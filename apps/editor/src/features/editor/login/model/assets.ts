import { z } from "zod";
import type { LoginThemeConfig } from "./theme-config";
import { MAX_IMAGE_SIZE_BYTES, LOGIN_IMAGE_EXTENSIONS, LOGIN_IMAGE_MIME_TYPES } from "../../shared/files";



/**
 * Validates an uploaded image (client form + server `generateJar` validator both
 * use this — keep it pure, no React). Mirrors `favicon-upload.ts`'s schema.
 */
export const assetSchema = z
    .instanceof(File, { error: "Image must be a file." })
    .refine(
        file =>
            LOGIN_IMAGE_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext)) ||
            LOGIN_IMAGE_MIME_TYPES.includes(file.type),
        "Use a PNG, SVG, or JPEG file.",
    )
    .refine(file => file.size <= MAX_IMAGE_SIZE_BYTES, "File is too large (max 1 MB).");

export function getImageError(file: File): string | null {
    const result = assetSchema.safeParse(file);
    return result.success ? null : (result.error.issues[0]?.message ?? "Invalid file.");
}


interface Assets {
    /** Doubles as the `assets` store key AND the multipart field name on export. */
    key: string;
    /** The `SHADCN_THEME_*` property (used by the live-preview object-URL override). */
    property: string;
    /** Filename stem written into the JAR's `login/resources/dist/`. */
    baseName: string;
    label: string;
    /** When set, the control only applies to this layout. */
    layout?: LoginThemeConfig["layout"];
}

/**
 * The images that can be set by URL **or** an uploaded file. Single source of
 * truth shared by the export client (`export-button`), the server bake
 * (`generate-jar`), the live preview (`routes/preview`), and the sidebar UI
 * (`images-panel`) — so naming and precedence can't drift across them.
 *
 * Favicon is intentionally absent: it's upload-only and has its own multi-file
 * `generateFaviconSet` pipeline.
 */
export const assetDefinitions = [
    {
        key: "logoUrl",
        property: "SHADCN_THEME_LOGO_URL",
        baseName: "logo",
        label: "Light logo",
    },
    {
        key: "logoDarkUrl",
        property: "SHADCN_THEME_LOGO_DARK_URL",
        baseName: "logo-dark",
        label: "Dark logo",
    },
    {
        key: "asideImageUrl",
        property: "SHADCN_THEME_ASIDE_IMAGE_URL",
        baseName: "aside-image",
        label: "Aside image",
        layout: "image-aside",
    },
    {
        key: "cardImageUrl",
        property: "SHADCN_THEME_CARD_IMAGE_URL",
        baseName: "card-background",
        label: "Card background",
        layout: "centered-card",
    },
    {
        key: "sidePanelImageUrl",
        property: "SHADCN_THEME_SIDE_PANEL_IMAGE_URL",
        baseName: "side-panel-image",
        label: "Side panel light image",
        layout: "two-column",
    },
    {
        key: "sidePanelImageDarkUrl",
        property: "SHADCN_THEME_SIDE_PANEL_IMAGE_DARK_URL",
        baseName: "side-panel-image-dark",
        label: "Side panel dark image",
        layout: "two-column",
    },
] as const satisfies readonly Assets[];


export const emptyAssets: Record<ThemeAssetKey, File | null> = {
    logoUrl: null,
    logoDarkUrl: null,
    asideImageUrl: null,
    favicon: null,
    cardImageUrl: null,
    sidePanelImageUrl: null,
    sidePanelImageDarkUrl: null,
};

export type AssetKey = (typeof assetDefinitions)[number]["key"];
export type AssetProperty = (typeof assetDefinitions)[number]["property"];
export type ThemeAssetKey = AssetKey | "favicon";
