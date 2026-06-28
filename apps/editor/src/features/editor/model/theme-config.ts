import type {
    BasePalette,
    FontFamily,
    Layout,
    RadiusPreset,
    ThemePreset,
} from "@kc-studio/shadcn-theme/theme";
import {
    DEFAULT_FONT,
    DEFAULT_THEME_ASIDE_IMAGE_URL,
    DEFAULT_THEME_BASE,
    DEFAULT_THEME_CARD_IMAGE_URL,
    DEFAULT_THEME_LAYOUT,
    DEFAULT_THEME_LOGO_DARK_URL,
    DEFAULT_THEME_LOGO_URL,
    DEFAULT_THEME_PRESET,
    DEFAULT_THEME_RADIUS,
    DEFAULT_THEME_SIDE_PANEL_IMAGE_DARK_URL,
    DEFAULT_THEME_SIDE_PANEL_IMAGE_URL,
    DEFAULT_WELCOME_MESSAGE,
} from "@kc-studio/shadcn-theme/theme";
import { Moon, Sun } from "lucide-react";
import type { Locale } from "./locales";
import { DEFAULT_LOCALE } from "./locales";

export type PreviewColorScheme = "light" | "dark";

type SchemeConfig = {
    value: PreviewColorScheme;
    label: string;
    icon: typeof Sun | typeof Moon;
};
export const SCHEMES = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
] as const satisfies ReadonlyArray<SchemeConfig>;

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
    logoUrl: string;
    logoDarkUrl: string;
    asideImageUrl: string;
    cardImageUrl: string;
    sidePanelImageUrl: string;
    sidePanelImageDarkUrl: string;
    welcomeMessage: string;
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
    logoUrl: DEFAULT_THEME_LOGO_URL,
    logoDarkUrl: DEFAULT_THEME_LOGO_DARK_URL,
    asideImageUrl: DEFAULT_THEME_ASIDE_IMAGE_URL,
    cardImageUrl: DEFAULT_THEME_CARD_IMAGE_URL,
    sidePanelImageUrl: DEFAULT_THEME_SIDE_PANEL_IMAGE_URL,
    sidePanelImageDarkUrl: DEFAULT_THEME_SIDE_PANEL_IMAGE_DARK_URL,
    welcomeMessage: DEFAULT_WELCOME_MESSAGE,
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
        SHADCN_THEME_SHOW_PLACEHOLDER: config.showPlaceholders ? "true" : "false",
        SHADCN_THEME_SHOW_REALM_NAME: config.showRealmName ? "true" : "false",
        SHADCN_THEME_LOGO_URL: config.logoUrl,
        SHADCN_THEME_LOGO_DARK_URL: config.logoDarkUrl,
        SHADCN_THEME_ASIDE_IMAGE_URL: config.asideImageUrl,
        SHADCN_THEME_CARD_IMAGE_URL: config.cardImageUrl,
        SHADCN_THEME_SIDE_PANEL_IMAGE_URL: config.sidePanelImageUrl,
        SHADCN_THEME_SIDE_PANEL_IMAGE_DARK_URL: config.sidePanelImageDarkUrl,
        SHADCN_THEME_WELCOME_MESSAGE: config.welcomeMessage,
    };
}
