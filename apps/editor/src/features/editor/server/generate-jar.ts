import type { ImageAssetKey } from "#/features/editor/model/assets";
import { getImageExtension, imageAssets, imageFileSchema } from "#/features/editor/model/assets";
import { faviconFileSchema } from "#/features/editor/model/favicon-upload";
import type { Locale } from "#/features/editor/model/locales";
import { supportedLocales } from "#/features/editor/model/locales";
import { themeNameSchema } from "#/features/editor/model/theme-name";
import {
    basePaletteOptions,
    fontFamilyOptions,
    layoutOptions,
    radiusPresetOptions,
    themePresetOptions,
} from "@kc-studio/shadcn-theme/theme";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateFaviconSet } from "./favicon";
import { customizeThemeJar } from "./jar-customizer";
import { loadTemplateJar } from "./template-jar";

/** Locale tags the theme supports, as a tuple for `z.enum`. */
const localeValues = supportedLocales.map(l => l.value) as [Locale, ...Locale[]];

/**
 * Validates the JSON `options` field. The enum fields mirror the theme's own
 * option arrays, so an unknown value is rejected here rather than baked into the
 * JAR as a broken default. URL/boolean fields are free-form (empty is allowed —
 * it maps to `${env.X:}`, identical to the stock template).
 */
const optionsSchema = z.object({
    config: z.object({
        basePalette: z.enum(basePaletteOptions),
        accent: z.enum(themePresetOptions),
        radius: z.enum(radiusPresetOptions),
        font: z.enum(fontFamilyOptions),
        layout: z.enum(layoutOptions),
        locale: z.enum(localeValues),
        showPlaceholders: z.boolean(),
        showRealmName: z.boolean(),
        logoUrl: z.string(),
        logoDarkUrl: z.string(),
        asideImageUrl: z.string(),
        cardImageUrl: z.string(),
        sidePanelImageUrl: z.string(),
        sidePanelImageDarkUrl: z.string(),
    }),
    themeName: themeNameSchema.optional(),
});

/**
 * Builds a themed Keycloak JAR from the editor's current config and streams it
 * back as a download.
 *
 * Transport is `multipart/form-data` (a POST server function whose validator
 * resolves to `FormData`): a JSON `options` field plus an optional `favicon`
 * file (PNG/SVG/ICO). The handler returns a raw `Response` — server functions
 * pass a `Response` through untouched — with the `application/java-archive`
 * content type so the browser saves it.
 */
export const generateJar = createServerFn({ method: "POST" })
    .inputValidator(data => {
        if (!(data instanceof FormData)) {
            throw new Error("Expected multipart/form-data.");
        }

        const rawOptions = data.get("options");
        if (typeof rawOptions !== "string") {
            throw new Error("Missing `options` field.");
        }
        const { config, themeName } = optionsSchema.parse(JSON.parse(rawOptions));

        const rawFavicon = data.get("favicon");
        const favicon = rawFavicon === null ? null : faviconFileSchema.parse(rawFavicon);

        // Optional uploaded images, keyed by their `imageAssets` field name.
        const imageFiles: Partial<Record<ImageAssetKey, File>> = {};
        for (const { key } of imageAssets) {
            const raw = data.get(key);
            if (raw !== null) imageFiles[key] = imageFileSchema.parse(raw);
        }

        return { config, themeName, favicon, imageFiles };
    })
    .handler(async ({ data }) => {
        const { themeName, favicon, imageFiles } = data;
        let config = data.config;

        const assets: Record<string, Uint8Array> = {};
        if (favicon) {
            const bytes = new Uint8Array(await favicon.arrayBuffer());
            Object.assign(assets, await generateFaviconSet(bytes));
        }

        // Uploaded images: bake the bytes into `dist/` and repoint the matching
        // SHADCN_THEME_*_URL at the bundled file (an upload overrides any URL).
        for (const { key, baseName } of imageAssets) {
            const file = imageFiles[key];
            if (!file) continue;
            const filename = `${baseName}.${getImageExtension(file)}`;
            assets[filename] = new Uint8Array(await file.arrayBuffer());
            config = { ...config, [key]: `%BASE_URL%/${filename}` };
        }

        const jar = customizeThemeJar(await loadTemplateJar(), {
            config,
            themeName,
            assets: Object.keys(assets).length > 0 ? assets : undefined,
        });

        const filename = `${themeName?.trim() || "shadcn-theme"}.jar`;
        return new Response(Buffer.from(jar), {
            headers: {
                "Content-Type": "application/java-archive",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    });
