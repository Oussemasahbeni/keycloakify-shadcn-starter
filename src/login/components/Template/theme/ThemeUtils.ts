import {
    DEFAULT_THEME_BASE,
    DEFAULT_THEME_PRESET,
    DEFAULT_THEME_RADIUS
} from "../Defaults";
import { basePalettes, radiusPresets, themeFontFamilies, themePresets } from "./Themes";
import {
    type FontFamily,
    type ModeTokens,
    type ThemeTokens,
    basePaletteOptions,
    radiusPresetOptions,
    themePresetOptions
} from "./ThemeTypes";

function isOption<TOption extends string>(
    value: string | undefined,
    options: readonly TOption[]
): value is TOption {
    return value !== undefined && (options as readonly string[]).includes(value);
}

/**
 * Resolves the final semantic token set used by the login template.
 *
 * Resolution flow:
 * 1. Validate the incoming `preset` and `base` values.
 * 2. Fall back to the configured defaults when a value is missing or invalid.
 * 3. Merge the selected base palette with the selected accent preset for both light and dark modes.
 *
 * @param params.base Neutral surface family requested by the caller.
 * @param params.preset Accent preset requested by the caller.
 * @returns A fully resolved light/dark token map ready to be written to CSS variables.
 */
export function resolveThemeTokens(params: {
    preset: string;
    base: string;
}): ModeTokens<ThemeTokens> {
    const preset = isOption(params.preset, themePresetOptions)
        ? params.preset
        : DEFAULT_THEME_PRESET;
    const base = isOption(params.base, basePaletteOptions)
        ? params.base
        : DEFAULT_THEME_BASE;

    return {
        light: {
            ...basePalettes[base].light,
            ...themePresets[preset].light
        },
        dark: {
            ...basePalettes[base].dark,
            ...themePresets[preset].dark
        }
    };
}

/**
 * Resolves a public radius preset into the CSS custom property value used at runtime.
 *
 * Invalid values fall back to the configured default preset. Returning `undefined`
 * for `default` keeps the stylesheet fallback in charge.
 *
 * @param value Radius preset requested by the caller.
 * @returns The CSS variable value to apply, or `undefined` for the default case.
 */
export function resolveRadiusPreset(value: string): string | undefined {
    const radius = isOption(value, radiusPresetOptions) ? value : DEFAULT_THEME_RADIUS;
    return radiusPresets[radius];
}

/**
 * Resolves a public font family name into the CSS custom property value used at runtime.
 *
 * Invalid values fall back to the default font family.
 * @param value
 * @returns
 */
export function resolveThemeFont(value: string | undefined): string {
    if (value && value in themeFontFamilies) {
        return themeFontFamilies[value as FontFamily];
    }

    return themeFontFamilies.geist;
}
