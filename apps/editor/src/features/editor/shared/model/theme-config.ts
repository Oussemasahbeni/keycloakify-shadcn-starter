import { resolveEmailTheme } from "@kc-studio/shadcn-theme/email";
import type {
    BasePalette,
    FontFamily,
    Layout,
    PrimaryPreset,
    RadiusPreset,
    SidePanelPosition,
} from "@kc-studio/shadcn-theme/theme";
import {
    basePaletteOptions,
    DEFAULT_FONT,
    DEFAULT_LOCALE,
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
    DEFAULT_THEME_SIDE_PANEL_POSITION,
    DEFAULT_WELCOME_MESSAGE,
    EMAIL_PROPERTY_KEYS,
    fontFamilyOptions,
    layoutOptions,
    primaryPresetOptions,
    radiusPresetOptions,
    sidePanelPositionOptions,
    THEME_PROPERTY_KEYS,
} from "@kc-studio/shadcn-theme/theme";
import type { Locale } from "../../../../lib/locales";
import { LOCALES } from "../../../../lib/locales";

import type { Equals } from "tsafe";
import { assert as assertType } from "tsafe";
import { z } from "zod";

export type ThemeConfig = {
    __version: 1;
    themeName: string;
    login: LoginThemeConfig;
    email: EmailThemeConfig;
};

export type LoginThemeConfig = {
    base: BasePalette;
    primary: PrimaryPreset;
    radius: RadiusPreset;
    font: FontFamily;
    layout: Layout;
    locale?: Locale;
    showPlaceholder: boolean;
    showRealmName: boolean;
    logoUrl: string;
    logoDarkUrl: string;
    asideImageUrl: string;
    cardImageUrl: string;
    sidePanelImageUrl: string;
    sidePanelImageDarkUrl: string;
    sidePanelPosition: SidePanelPosition;
    welcomeMessage: string;
};

export type EmailThemeConfig = {
    primary?: PrimaryPreset;
    logoUrl?: string;
    locale?: Locale;
};

export const loginThemeConfigSchema = (() => {
    const schema = z.object({
        base: z.enum(basePaletteOptions),
        primary: z.enum(primaryPresetOptions),
        radius: z.enum(radiusPresetOptions),
        font: z.enum(fontFamilyOptions),
        layout: z.enum(layoutOptions),
        locale: z.enum(LOCALES).optional(),
        showPlaceholder: z.boolean(),
        showRealmName: z.boolean(),
        logoUrl: z.string(),
        logoDarkUrl: z.string(),
        asideImageUrl: z.string(),
        cardImageUrl: z.string(),
        sidePanelImageUrl: z.string(),
        sidePanelImageDarkUrl: z.string(),
        sidePanelPosition: z.enum(sidePanelPositionOptions),
        welcomeMessage: z.string(),
    });
    assertType<Equals<z.infer<typeof schema>, LoginThemeConfig>>();
    return schema;
})();

export const emailThemeConfigSchema = (() => {
    const schema = z.object({
        primary: z.enum(primaryPresetOptions).optional(),
        logoUrl: z.string().optional(),
        locale: z.enum(LOCALES).optional(),
    });
    assertType<Equals<z.infer<typeof schema>, EmailThemeConfig>>();
    return schema;
})();

export const themeConfigSchema = (() => {
    const schema = z.object({
        __version: z.literal(1),
        themeName: z.string(),
        login: loginThemeConfigSchema,
        email: emailThemeConfigSchema,
    });
    assertType<Equals<z.infer<typeof schema>, ThemeConfig>>();
    return schema;
})();

export const defaultLoginThemeConfig: LoginThemeConfig = {
    base: DEFAULT_THEME_BASE,
    primary: DEFAULT_THEME_PRESET,
    radius: DEFAULT_THEME_RADIUS,
    font: DEFAULT_FONT,
    layout: DEFAULT_THEME_LAYOUT,
    locale: DEFAULT_LOCALE,
    showPlaceholder: true,
    showRealmName: true,
    logoUrl: DEFAULT_THEME_LOGO_URL,
    logoDarkUrl: DEFAULT_THEME_LOGO_DARK_URL,
    asideImageUrl: DEFAULT_THEME_ASIDE_IMAGE_URL,
    cardImageUrl: DEFAULT_THEME_CARD_IMAGE_URL,
    sidePanelImageUrl: DEFAULT_THEME_SIDE_PANEL_IMAGE_URL,
    sidePanelImageDarkUrl: DEFAULT_THEME_SIDE_PANEL_IMAGE_DARK_URL,
    sidePanelPosition: DEFAULT_THEME_SIDE_PANEL_POSITION,
    welcomeMessage: DEFAULT_WELCOME_MESSAGE,
};

/**
 * Maps a {@link LoginThemeConfig} onto the `SHADCN_THEME_*` Keycloak theme properties.
 *
 * Single source of truth shared by the live preview (`routes/preview.tsx`, which
 * feeds these into `getKcContextMock`) and the JAR export feature (which bakes
 * them as `theme.properties` defaults). Keep both consumers reading from here so
 * the preview and the downloaded JAR can never drift apart.
 */
export function themeConfigToProperties(config: LoginThemeConfig): Record<string, string> {
    return {
        [THEME_PROPERTY_KEYS.layout]: config.layout,
        [THEME_PROPERTY_KEYS.base]: config.base,
        [THEME_PROPERTY_KEYS.primary]: config.primary,
        [THEME_PROPERTY_KEYS.radius]: config.radius,
        [THEME_PROPERTY_KEYS.font]: config.font,
        [THEME_PROPERTY_KEYS.showPlaceholder]: config.showPlaceholder ? "true" : "false",
        [THEME_PROPERTY_KEYS.showRealmName]: config.showRealmName ? "true" : "false",
        [THEME_PROPERTY_KEYS.logoUrl]: config.logoUrl,
        [THEME_PROPERTY_KEYS.logoDarkUrl]: config.logoDarkUrl,
        [THEME_PROPERTY_KEYS.asideImageUrl]: config.asideImageUrl,
        [THEME_PROPERTY_KEYS.cardImageUrl]: config.cardImageUrl,
        [THEME_PROPERTY_KEYS.sidePanelImageUrl]: config.sidePanelImageUrl,
        [THEME_PROPERTY_KEYS.sidePanelImageDarkUrl]: config.sidePanelImageDarkUrl,
        [THEME_PROPERTY_KEYS.sidePanelPosition]: config.sidePanelPosition,
        [THEME_PROPERTY_KEYS.welcomeMessage]: config.welcomeMessage,
    };
}

/**
 * Maps the email config onto the `SHADCN_EMAIL_*` Keycloak theme properties.
 *
 * Colors are resolved to hex **here** (in JS): Keycloak renders emails through
 * FreeMarker, which can't run the preset→hex resolution at send time, so the hex
 * must be baked into `theme.properties`. The foreground is derived from the same
 * preset so button text contrasts the primary. The email primary defaults to the
 * login primary (keeping emails correlated with the login theme) unless the user
 * overrides it in the email panel.
 */
export function emailConfigToProperties(
    config: EmailThemeConfig | undefined,
    loginPrimary: PrimaryPreset,
): Record<string, string> {
    if (!config) return {};

    const emailPreset = config.primary ?? loginPrimary;

    const theme = resolveEmailTheme(emailPreset, config.logoUrl);
    return {
        [EMAIL_PROPERTY_KEYS.primaryColor]: theme.primaryColor,
        [EMAIL_PROPERTY_KEYS.foregroundColor]: theme.foregroundColor,
        [EMAIL_PROPERTY_KEYS.logoUrl]: theme.logoUrl ?? "",
    };
}
