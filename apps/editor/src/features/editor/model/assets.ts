import { z } from "zod";
import type { ThemeConfig } from "./theme-config";

export const MAX_IMAGE_SIZE_BYTES = 1024 * 1024; // 1 MB

const IMAGE_EXTENSIONS = [".png", ".svg", ".jpg", ".jpeg"];
const IMAGE_MIME_TYPES = ["image/png", "image/svg+xml", "image/jpeg"];

/**
 * Validates an uploaded image (client form + server `generateJar` validator both
 * use this — keep it pure, no React). Mirrors `favicon-upload.ts`'s schema.
 */
export const imageFileSchema = z
    .instanceof(File, { error: "Image must be a file." })
    .refine(
        file =>
            IMAGE_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext)) ||
            IMAGE_MIME_TYPES.includes(file.type),
        "Use a PNG, SVG, or JPEG file.",
    )
    .refine(file => file.size <= MAX_IMAGE_SIZE_BYTES, "File is too large (max 1 MB).");

export function getImageError(file: File): string | null {
    const result = imageFileSchema.safeParse(file);
    return result.success ? null : (result.error.issues[0]?.message ?? "Invalid file.");
}

const EXTENSION_BY_MIME: Record<string, string> = {
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/jpeg": "jpg",
};

/**
 * Safe lowercase extension for the baked asset filename, from the upload's name
 * (preferred) or MIME type. Defaults to `png`. The result feeds a `<baseName>.<ext>`
 * filename that must satisfy the JAR's `ASSET_NAME_PATTERN`.
 */
export function getImageExtension(file: File): string {
    const fromName = /\.([a-z0-9]+)$/.exec(file.name.toLowerCase())?.[1];
    if (fromName === "jpeg") return "jpg";
    if (fromName && ["png", "svg", "jpg"].includes(fromName)) return fromName;
    return EXTENSION_BY_MIME[file.type] ?? "png";
}

type ImageAssetDescriptor = {
    /** Doubles as the `files` store key AND the multipart field name on export. */
    key: string;
    /** The `SHADCN_THEME_*` property (used by the live-preview object-URL override). */
    property: string;
    /** Filename stem written into the JAR's `login/resources/dist/`. */
    baseName: string;
    label: string;
    /** When set, the control only applies to this layout. */
    layout?: ThemeConfig["layout"];
};

/**
 * The images that can be set by URL **or** an uploaded file. Single source of
 * truth shared by the export client (`export-button`), the server bake
 * (`generate-jar`), the live preview (`routes/preview`), and the sidebar UI
 * (`images-panel`) — so naming and precedence can't drift across them.
 *
 * Favicon is intentionally absent: it's upload-only and has its own multi-file
 * `generateFaviconSet` pipeline.
 */
export const imageAssets = [
    {
        key: "logoWhiteUrl",
        property: "SHADCN_THEME_LOGO_WHITE_URL",
        baseName: "logo-white",
        label: "Light logo",
    },
    {
        key: "logoDarkUrl",
        property: "SHADCN_THEME_LOGO_DARK_URL",
        baseName: "logo-dark",
        label: "Dark logo",
    },
    {
        key: "sideImageUrl",
        property: "SHADCN_THEME_SIDE_IMAGE_URL",
        baseName: "side-image",
        label: "Side image",
        layout: "image-aside",
    },
    {
        key: "cardBackgroundUrl",
        property: "SHADCN_THEME_CARD_BG_URL",
        baseName: "card-background",
        label: "Card background",
        layout: "centered-card",
    },
] as const satisfies readonly ImageAssetDescriptor[];

export type ImageAssetKey = (typeof imageAssets)[number]["key"];
export type ThemeAssetKey = ImageAssetKey | "favicon";
