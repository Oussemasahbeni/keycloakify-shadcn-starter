import { useKcContext } from "../../../KcContext";
import { resolveRadiusPreset, resolveThemeFont, resolveThemeTokens } from "./ThemeUtils";

/**
 * Maps semantic theme tokens to the runtime CSS variables consumed by `index.css`.
 * We write both light and dark values up front so the `.dark` class can switch
 * instantly without recomputing the palette.
 */
const themeCssVars = {
    light: {
        background: "--keycloakify-shadcn-background",
        foreground: "--keycloakify-shadcn-foreground",
        card: "--keycloakify-shadcn-card",
        cardForeground: "--keycloakify-shadcn-card-foreground",
        popover: "--keycloakify-shadcn-popover",
        popoverForeground: "--keycloakify-shadcn-popover-foreground",
        primary: "--keycloakify-shadcn-primary",
        primaryForeground: "--keycloakify-shadcn-primary-foreground",
        secondary: "--keycloakify-shadcn-secondary",
        secondaryForeground: "--keycloakify-shadcn-secondary-foreground",
        muted: "--keycloakify-shadcn-muted",
        mutedForeground: "--keycloakify-shadcn-muted-foreground",
        accent: "--keycloakify-shadcn-accent",
        accentForeground: "--keycloakify-shadcn-accent-foreground",
        border: "--keycloakify-shadcn-border",
        input: "--keycloakify-shadcn-input",
        ring: "--keycloakify-shadcn-ring"
    },
    dark: {
        background: "--keycloakify-shadcn-dark-background",
        foreground: "--keycloakify-shadcn-dark-foreground",
        card: "--keycloakify-shadcn-dark-card",
        cardForeground: "--keycloakify-shadcn-dark-card-foreground",
        popover: "--keycloakify-shadcn-dark-popover",
        popoverForeground: "--keycloakify-shadcn-dark-popover-foreground",
        primary: "--keycloakify-shadcn-dark-primary",
        primaryForeground: "--keycloakify-shadcn-dark-primary-foreground",
        secondary: "--keycloakify-shadcn-dark-secondary",
        secondaryForeground: "--keycloakify-shadcn-dark-secondary-foreground",
        muted: "--keycloakify-shadcn-dark-muted",
        mutedForeground: "--keycloakify-shadcn-dark-muted-foreground",
        accent: "--keycloakify-shadcn-dark-accent",
        accentForeground: "--keycloakify-shadcn-dark-accent-foreground",
        border: "--keycloakify-shadcn-dark-border",
        input: "--keycloakify-shadcn-dark-input",
        ring: "--keycloakify-shadcn-dark-ring"
    }
} as const;

type ThemeTokenKey = keyof (typeof themeCssVars)["light"];
type ThemeCssVarMap = Record<ThemeTokenKey, string>;

function applyThemeCssVars(params: {
    style: CSSStyleDeclaration;
    theme: Record<ThemeTokenKey, string>;
    cssVars: ThemeCssVarMap;
}) {
    const { style, theme, cssVars } = params;

    for (const token of Object.keys(cssVars) as ThemeTokenKey[]) {
        style.setProperty(cssVars[token], theme[token]);
    }
}

/**
 * Applies the resolved theme preset to the document root.
 * The source of truth is `kcContext.properties`, so both Storybook globals and
 * deployed environment variables go through the same path.
 */
export function useApplyThemePreset() {
    const { kcContext } = useKcContext();

    const root = document.documentElement;
    const theme = resolveThemeTokens({
        preset: kcContext.properties.SHADCN_THEME_PRESET,
        base: kcContext.properties.SHADCN_THEME_BASE
    });
    const radius = resolveRadiusPreset(kcContext.properties.SHADCN_THEME_RADIUS);

    applyThemeCssVars({
        style: root.style,
        theme: theme.light,
        cssVars: themeCssVars.light
    });
    applyThemeCssVars({
        style: root.style,
        theme: theme.dark,
        cssVars: themeCssVars.dark
    });

    document.documentElement.style.setProperty(
        "--keycloakify-shadcn-font",
        resolveThemeFont(kcContext.properties.SHADCN_THEME_FONT)
    );

    if (radius) {
        root.style.setProperty("--keycloakify-shadcn-radius", radius);
        return;
    }

    root.style.removeProperty("--keycloakify-shadcn-radius");
}
