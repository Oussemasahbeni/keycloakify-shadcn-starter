import { DEFAULT_THEME_PRESET } from "#/login/theme";

import { resolveColors } from "./resolve-email-theme";

/**
 * Email theme env vars. Values are always **resolved hex colors** (or a URL),
 * never preset names: Keycloak renders emails through FreeMarker, which only
 * substitutes `${...}` as text and cannot run the preset→hex resolution the
 * login theme does in the browser. So the hex must be baked in ahead of time —
 * the editor writes the resolved value into `theme.properties`, and the `default`
 * here is the fallback for a raw install (the neutral preset's hex).
 */
export const EMAIL_ENV = {
    primaryColor: { name: "SHADCN_EMAIL_PRIMARY_COLOR", default: "#171717" },
    foregroundColor: { name: "SHADCN_EMAIL_FOREGROUND_COLOR", default: "#fafafa" },
    logoUrl: { name: "SHADCN_EMAIL_LOGO_URL", default: "" },
} as const;

export type EmailTheme = {
    primaryColor: string;
    foregroundColor: string;
    logoUrl: string | undefined;
    /**
     * True only when rendering the real FreeMarker template (`getTemplate`).
     * The preview renders the same components with resolved values, so it must
     * *not* emit FreeMarker directives (`<#if>`); this flag lets shared
     * components (e.g. the logo gate in `EmailLayout`) branch on the target.
     */
    ftl?: boolean;
};

const colors = resolveColors(DEFAULT_THEME_PRESET);

// Used by emails:preview and the editor default.
export const defaultEmailTheme: EmailTheme = {
    primaryColor: colors.primaryColor,
    foregroundColor: colors.foregroundColor,
    logoUrl: undefined,
};

/**
 * FreeMarker TOKENS, used only by `getTemplate`. Each color is emitted directly
 * as a `${properties.X!'#default'}` expression — verified to survive jsx-email's
 * inline-style rendering verbatim (including the MSO `fillcolor` VML attribute),
 * so no sentinel/post-render replacement is needed. The foreground reads its own
 * property so it can contrast the primary. Produces e.g.
 * `${properties.SHADCN_EMAIL_PRIMARY_COLOR!'#171717'}`.
 */
export const ftlEmailTheme = (exp: (name: `properties.${string}`) => string): EmailTheme => ({
    primaryColor: exp(`properties.${EMAIL_ENV.primaryColor.name}!'${EMAIL_ENV.primaryColor.default}'`),
    foregroundColor: exp(`properties.${EMAIL_ENV.foregroundColor.name}!'${EMAIL_ENV.foregroundColor.default}'`),
    logoUrl: exp(`properties.${EMAIL_ENV.logoUrl.name}!'${EMAIL_ENV.logoUrl.default}'`),
    ftl: true,
});
