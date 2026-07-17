/**
 * Neutral surface tokens owned by the selected base palette.
 */
export type BaseSurfaceTokens = {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    input: string;
    ring: string;
    sidePanel: string;
    sidePanelForeground: string;
};

/**
 * Brand and action tokens owned by the selected primary preset.
 */
export type PrimaryTokens = {
    primary: string;
    primaryForeground: string;
};

/**
 * Fully resolved semantic theme tokens consumed by the runtime CSS variable layer.
 */
export type ThemeTokens = BaseSurfaceTokens & PrimaryTokens;

/**
 * Light and dark variants for the same token family.
 */
export type ModeTokens<T> = {
    light: T;
    dark: T;
};

/**
 * Supported accent presets exposed through env vars and Storybook.
 * Keep this list in sync with the public theming documentation.
 */
export const primaryPresetOptions = [
    "neutral",
    "amber",
    "blue",
    "cyan",
    "emerald",
    "fuchsia",
    "green",
    "indigo",
    "lime",
    "orange",
    "pink",
    "purple",
    "red",
    "rose",
    "sky",
    "teal",
    "violet",
    "yellow",
] as const;

/**
 * Supported neutral base palettes exposed through env vars and Storybook.
 */
export const basePaletteOptions = [
    "neutral",
    "stone",
    "zinc",
    "mauve",
    "olive",
    "mist",
    "taupe",
] as const;

/**
 * Supported radius presets exposed through env vars and Storybook.
 */
export const radiusPresetOptions = ["default", "none", "small", "medium", "large"] as const;

/**
 * Supported font family options exposed through env vars and Storybook.
 */
export const fontFamilyOptions = [
    "inter",
    "geist",
    "manrope",
    "figtree",
    "source-sans-3",
    "ibm-plex-sans",
    "lora",
    "playfair-display",
    "jetbrains-mono",
] as const;

export const layoutOptions = ["two-column", "centered-card", "image-aside"] as const;

/**
 * Which side of the two-column layout the branded side panel sits on.
 * Only meaningful for the `two-column` layout.
 */
export const sidePanelPositionOptions = ["right", "left"] as const;

export type PrimaryPreset = (typeof primaryPresetOptions)[number];
export type BasePalette = (typeof basePaletteOptions)[number];
export type RadiusPreset = (typeof radiusPresetOptions)[number];
export type FontFamily = (typeof fontFamilyOptions)[number];

export type Layout = (typeof layoutOptions)[number];
export type SidePanelPosition = (typeof sidePanelPositionOptions)[number];
