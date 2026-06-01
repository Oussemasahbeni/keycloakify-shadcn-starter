import {
    DEFAULT_FONT,
    DEFAULT_THEME_BASE,
    DEFAULT_THEME_LAYOUT,
    DEFAULT_THEME_PRESET,
    DEFAULT_THEME_RADIUS,
} from '@kc-studio/shadcn-theme/defaults';
import type {
    BasePalette,
    FontFamily,
    Layout,
    RadiusPreset,
    ThemePreset,
} from '@kc-studio/shadcn-theme/theme-meta';
import type { Locale } from './locales';
import { DEFAULT_LOCALE } from './locales';

export type PreviewColorScheme = 'light' | 'dark';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type ThemeConfig = {
    basePalette: BasePalette;
    accent: ThemePreset;
    radius: RadiusPreset;
    font: FontFamily;
    layout: Layout;
    locale: Locale;
    showPlaceholders: boolean;
};

export const defaultThemeConfig: ThemeConfig = {
    basePalette: DEFAULT_THEME_BASE,
    accent: DEFAULT_THEME_PRESET,
    radius: DEFAULT_THEME_RADIUS,
    font: DEFAULT_FONT,
    layout: DEFAULT_THEME_LAYOUT,
    locale: DEFAULT_LOCALE,
    showPlaceholders: true,
};
