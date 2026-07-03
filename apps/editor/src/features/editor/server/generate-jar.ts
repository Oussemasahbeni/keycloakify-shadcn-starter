import type { AssetKey } from "#/features/editor/model/assets";
import { assetDefinitions, assetSchema, getImageExtension } from "#/features/editor/model/assets";
import { faviconFileSchema } from "#/features/editor/model/favicon-upload";
import { themeNameSchema } from "#/features/editor/model/theme-name";
import { oidcFnMiddleware } from "#/oidc";
import {
    basePaletteOptions,
    fontFamilyOptions,
    layoutOptions,
    radiusPresetOptions,
    sidePanelPositionOptions,
    themePresetOptions,
} from "@kc-studio/shadcn-theme/theme";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateFaviconSet } from "./favicon";
import { customizeThemeJar } from "./jar-customizer";
import { loadTemplateJar } from "./template-jar";

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
        showPlaceholder: z.boolean(),
        showRealmName: z.boolean(),
        logoUrl: z.string(),
        logoDarkUrl: z.string(),
        asideImageUrl: z.string(),
        cardImageUrl: z.string(),
        sidePanelImageUrl: z.string(),
        sidePanelImageDarkUrl: z.string(),
        welcomeMessage: z.string(),
        sidePanelPosition: z.enum(sidePanelPositionOptions),
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
    .middleware([oidcFnMiddleware({ assert: "user logged in" })])
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

        const assets: Partial<Record<AssetKey, File>> = {};
        for (const { key } of assetDefinitions) {
            const raw = data.get(key);
            if (raw !== null) assets[key] = assetSchema.parse(raw);
        }

        return { config, themeName, favicon, assets };
    })
    .handler(async ({ data }) => {
        const { themeName, favicon, assets } = data;
        let config = data.config;

        const assetsRecord: Record<string, Uint8Array> = {};
        if (favicon) {
            const bytes = new Uint8Array(await favicon.arrayBuffer());
            Object.assign(assetsRecord, await generateFaviconSet(bytes));
        }

        // Uploaded images: bake the bytes into `dist/` and repoint the matching
        // SHADCN_THEME_*_URL at the bundled file (an upload overrides any URL).
        for (const { key, baseName } of assetDefinitions) {
            const file = assets[key];
            if (!file) continue;
            const filename = `${baseName}.${getImageExtension(file)}`;
            assetsRecord[filename] = new Uint8Array(await file.arrayBuffer());
            config = { ...config, [key]: `%BASE_URL%/${filename}` };
        }

        const jar = customizeThemeJar(await loadTemplateJar(), {
            config,
            themeName,
            assets: Object.keys(assetsRecord).length > 0 ? assetsRecord : undefined,
        });

        const filename = `${themeName?.trim() || "shadcn-theme"}.jar`;
        return new Response(Buffer.from(jar), {
            headers: {
                "Content-Type": "application/java-archive",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    });
