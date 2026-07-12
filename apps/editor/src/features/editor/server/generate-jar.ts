import type { AssetKey } from "#/features/editor/login/model/assets.ts";
import { assetDefinitions, assetSchema } from "#/features/editor/login/model/assets.ts";
import { faviconFileSchema } from "#/features/editor/login/model/favicon-upload";
import { themeNameSchema } from "#/features/editor/login/model/theme-name";
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
import { emailLogoSchema } from "../email/model/assets";
import { getImageExtension } from "../shared/files";
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
    /**
     * Email theme choices. Optional and all-partial: an omitted `primaryPreset`
     * inherits the login accent, keeping emails correlated with the login theme.
     */
    email: z
        .object({
            primaryPreset: z.enum(themePresetOptions).optional(),
            logoUrl: z.string().optional(),
        })
        .optional(),
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
    .validator(data => {
        if (!(data instanceof FormData)) {
            throw new Error("Expected multipart/form-data.");
        }

        const rawOptions = data.get("options");
        if (typeof rawOptions !== "string") {
            throw new Error("Missing `options` field.");
        }
        const { config, email, themeName } = optionsSchema.parse(JSON.parse(rawOptions));

        const rawFavicon = data.get("favicon");
        const favicon = rawFavicon === null ? null : faviconFileSchema.parse(rawFavicon);

        const assets: Partial<Record<AssetKey, File>> = {};
        for (const { key } of assetDefinitions) {
            const raw = data.get(key);
            if (raw !== null) assets[key] = assetSchema.parse(raw);
        }

        const rawEmailLogo = data.get("emailLogoFile");
        const emailLogoFile = rawEmailLogo === null ? null : emailLogoSchema.parse(rawEmailLogo);

        return { config, email, themeName, favicon, assets, emailLogoFile };
    })
    .handler(async ({ data }) => {
        const { email, themeName, favicon, assets, emailLogoFile } = data;
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

        const emailAssets: Record<string, Uint8Array> = {};
        let emailLogoUrl = email?.logoUrl;
        if (emailLogoFile) {
            const filename = `logo.${getImageExtension(emailLogoFile)}`;
            emailAssets[filename] = new Uint8Array(await emailLogoFile.arrayBuffer());
            emailLogoUrl = filename;
        }

        const jar = customizeThemeJar(await loadTemplateJar(), {
            config,
            email: {
                primaryPreset: email?.primaryPreset,
                logoUrl: emailLogoUrl,
            },
            themeName,
            assets: Object.keys(assetsRecord).length > 0 ? assetsRecord : undefined,
            emailAssets: Object.keys(emailAssets).length > 0 ? emailAssets : undefined,
        });

        const filename = `${themeName?.trim() || "shadcn-theme"}.jar`;
        return new Response(Buffer.from(jar), {
            headers: {
                "Content-Type": "application/java-archive",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    });
