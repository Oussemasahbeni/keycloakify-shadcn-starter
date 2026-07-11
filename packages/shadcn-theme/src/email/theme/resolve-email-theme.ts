import type { ThemePreset } from "#/login/theme";
import { themePresets } from "#/login/theme";
import { formatHex, parse } from "culori";
import type { EmailTheme } from "./theme";

export function resolveEmailTheme(preset: ThemePreset, logoUrl: string | undefined): EmailTheme {
    const colors = resolveColors(preset);
    return {
        ...colors,
        logoUrl,
    };
}

export function resolveColors(preset: ThemePreset): {
    primaryColor: string;
    foregroundColor: string;
} {
    const themePreset = themePresets[preset];

    return {
        primaryColor: formatHex(parse(themePreset.light.primary))!,
        foregroundColor: formatHex(parse(themePreset.light.primaryForeground))!,
    };
}
