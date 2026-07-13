import { resolveEmailTheme } from "@kc-studio/shadcn-theme/email";
import type { ThemePreset } from "@kc-studio/shadcn-theme/theme";
import type { Locale } from "../../shared/locales";

export interface EmailThemeConfig {
    /** Accent preset for emails. `undefined` = inherit the login accent. */
    primaryPreset?: ThemePreset;
    logoUrl?: string;
    locale?: Locale;
}

/** Effective email accent — the override if set, otherwise the login accent. */
export function resolveEmailPreset(config: EmailThemeConfig, loginAccent: ThemePreset): ThemePreset {
    return config.primaryPreset ?? loginAccent;
}

/**
 * Maps the email config onto the `SHADCN_EMAIL_*` Keycloak theme properties.
 *
 * Colors are resolved to hex **here** (in JS): Keycloak renders emails through
 * FreeMarker, which can't run the preset→hex resolution at send time, so the hex
 * must be baked into `theme.properties`. The foreground is derived from the same
 * preset so button text contrasts the primary. The email accent defaults to the
 * login accent (keeping emails correlated with the login theme) unless the user
 * overrides it in the email panel.
 */
export function emailConfigToProperties(
    config: EmailThemeConfig | undefined,
    loginAccent: ThemePreset,
): Record<string, string> {
    if (!config) return {};
    const theme = resolveEmailTheme(resolveEmailPreset(config, loginAccent), config.logoUrl);
    return {
        SHADCN_EMAIL_PRIMARY_COLOR: theme.primaryColor,
        SHADCN_EMAIL_FOREGROUND_COLOR: theme.foregroundColor,
        SHADCN_EMAIL_LOGO_URL: theme.logoUrl ?? "",
    };
}
