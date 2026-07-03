export const EMAIL_ENV = {
    primaryColor: { name: "SHADCN_EMAIL_PRIMARY_COLOR", default: "#6366f1" },
    buttonTextColor: { name: "SHADCN_EMAIL_BUTTON_TEXT_COLOR", default: "#ffffff" },
    logoUrl: { name: "SHADCN_EMAIL_LOGO_URL", default: "" },
} as const;

export interface EmailTheme {
    primaryColor: string;
    buttonTextColor: string;
    logoUrl: string;
}

// Rused by emails:preview and the editor default.
export const defaultEmailTheme: EmailTheme = {
    primaryColor: EMAIL_ENV.primaryColor.default,
    buttonTextColor: EMAIL_ENV.buttonTextColor.default,
    logoUrl: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/keycloak.svg",
};

// FreeMarker TOKENS, used only by getTemplate;
// Produces: ${properties.SHADCN_EMAIL_PRIMARY_COLOR!'#6366f1'}
export const ftlEmailTheme = (exp: (name: `properties.${string}`) => string): EmailTheme => ({
    primaryColor: exp(
        `properties.${EMAIL_ENV.primaryColor.name}!'${EMAIL_ENV.primaryColor.default}'`,
    ),
    buttonTextColor: exp(
        `properties.${EMAIL_ENV.buttonTextColor.name}!'${EMAIL_ENV.buttonTextColor.default}'`,
    ),
    logoUrl: exp(`properties.${EMAIL_ENV.logoUrl.name}!'${EMAIL_ENV.logoUrl.default}'`),
});
