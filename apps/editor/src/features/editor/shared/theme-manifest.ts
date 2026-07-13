import { themeNameSchema } from "#/features/editor/login/model/theme-name";
import {
    basePaletteOptions,
    fontFamilyOptions,
    layoutOptions,
    radiusPresetOptions,
    sidePanelPositionOptions,
    themePresetOptions,
} from "@kc-studio/shadcn-theme/theme";
import { z } from "zod";

/**
 * Fixed path of the config manifest embedded in every exported JAR. Lives outside
 * the (renamable) `theme/<name>/` dir so import can find it without knowing the
 * theme name first, and is inert to Keycloak's theme scanner.
 */
export const MANIFEST_PATH = "META-INF/kc-studio-theme.json";

/**
 * The portable theme payload. Identical to the export server fn's `options` field,
 * so it round-trips losslessly. Enum fields mirror the theme's option arrays, so
 * an unknown/tampered value is rejected on import rather than corrupting state.
 */
export const themeManifestSchema = z.object({
    version: z.string(),
    email: z
        .object({
            primaryPreset: z.enum(themePresetOptions).optional(),
            logoUrl: z.string().optional(),
        })
        .optional(),
    login: z.object({
        basePalette: z.enum(basePaletteOptions),
        accent: z.enum(themePresetOptions),
        radius: z.enum(radiusPresetOptions),
        font: z.enum(fontFamilyOptions),
        layout: z.enum(layoutOptions),
        showPlaceholder: z.boolean(),
        showRealmName: z.boolean(),
        welcomeMessage: z.string(),
        sidePanelPosition: z.enum(sidePanelPositionOptions),
        logoUrl: z.string(),
        logoDarkUrl: z.string(),
        asideImageUrl: z.string(),
        cardImageUrl: z.string(),
        sidePanelImageUrl: z.string(),
        sidePanelImageDarkUrl: z.string(),
    }),
    themeName: themeNameSchema.optional(),
});

export type ThemeManifest = z.infer<typeof themeManifestSchema>;
