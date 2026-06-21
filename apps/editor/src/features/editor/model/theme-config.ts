import type {
    BasePalette,
    FontFamily,
    Layout,
    RadiusPreset,
    ThemePreset,
} from "@kc-studio/shadcn-theme/theme";
import {
    DEFAULT_FONT,
    DEFAULT_THEME_BASE,
    DEFAULT_THEME_CARD_BG_URL,
    DEFAULT_THEME_LAYOUT,
    DEFAULT_THEME_LOGO_DARK_URL,
    DEFAULT_THEME_LOGO_WHITE_URL,
    DEFAULT_THEME_PRESET,
    DEFAULT_THEME_RADIUS,
    DEFAULT_THEME_SIDE_IMAGE_URL,
} from "@kc-studio/shadcn-theme/theme";
import type { Locale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";

export type PreviewColorScheme = "light" | "dark";

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type ThemeConfig = {
    basePalette: BasePalette;
    accent: ThemePreset;
    radius: RadiusPreset;
    font: FontFamily;
    layout: Layout;
    locale: Locale;
    showPlaceholders: boolean;
    showRealmName: boolean;
    logoWhiteUrl: string;
    logoDarkUrl: string;
    sideImageUrl: string;
    cardBackgroundUrl: string;
};

export const defaultThemeConfig: ThemeConfig = {
    basePalette: DEFAULT_THEME_BASE,
    accent: DEFAULT_THEME_PRESET,
    radius: DEFAULT_THEME_RADIUS,
    font: DEFAULT_FONT,
    layout: DEFAULT_THEME_LAYOUT,
    locale: DEFAULT_LOCALE,
    showPlaceholders: true,
    showRealmName: true,
    logoWhiteUrl: DEFAULT_THEME_LOGO_WHITE_URL,
    logoDarkUrl: DEFAULT_THEME_LOGO_DARK_URL,
    sideImageUrl: DEFAULT_THEME_SIDE_IMAGE_URL,
    cardBackgroundUrl: DEFAULT_THEME_CARD_BG_URL,
};

/**
 * Maps a {@link ThemeConfig} onto the `SHADCN_THEME_*` Keycloak theme properties.
 *
 * Single source of truth shared by the live preview (`routes/preview.tsx`, which
 * feeds these into `getKcContextMock`) and the JAR export feature (which bakes
 * them as `theme.properties` defaults). Keep both consumers reading from here so
 * the preview and the downloaded JAR can never drift apart.
 */
export function themeConfigToProperties(config: ThemeConfig): Record<string, string> {
    return {
        SHADCN_THEME_LAYOUT: config.layout,
        SHADCN_THEME_BASE: config.basePalette,
        SHADCN_THEME_PRESET: config.accent,
        SHADCN_THEME_RADIUS: config.radius,
        SHADCN_THEME_FONT: config.font,
        SHADCN_THEME_PLACEHOLDER: config.showPlaceholders ? "true" : "false",
        SHADCN_THEME_SHOW_REALM_NAME: config.showRealmName ? "true" : "false",
        SHADCN_THEME_LOGO_WHITE_URL: config.logoWhiteUrl,
        SHADCN_THEME_LOGO_DARK_URL: config.logoDarkUrl,
        SHADCN_THEME_SIDE_IMAGE_URL: config.sideImageUrl,
        SHADCN_THEME_CARD_BG_URL: config.cardBackgroundUrl,
    };
}
