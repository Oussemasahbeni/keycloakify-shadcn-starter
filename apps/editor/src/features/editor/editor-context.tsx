import { createContext, useContext, useState } from 'react';

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
import { DEFAULT_LOCALE, type Locale } from './locales';
import type { Viewport } from './viewport';

export type PreviewColorScheme = 'light' | 'dark';

/** Persistence status. Inert until the token-editing + autosave unit lands. */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

type EditorContextValue = {
    viewport: Viewport;
    setViewport: (viewport: Viewport) => void;
    previewColorScheme: PreviewColorScheme;
    setPreviewColorScheme: (scheme: PreviewColorScheme) => void;
    togglePreviewColorScheme: () => void;
    config: ThemeConfig;
    updateConfig: (patch: Partial<ThemeConfig>) => void;
    saveStatus: SaveStatus;
    lastSavedAt: Date | null;
};

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

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const [viewport, setViewport] = useState<Viewport>('desktop');
    const [previewColorScheme, setPreviewColorScheme] = useState<PreviewColorScheme>('light');
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);

    const value: EditorContextValue = {
        viewport,
        setViewport,
        previewColorScheme,
        setPreviewColorScheme,
        togglePreviewColorScheme: () =>
            setPreviewColorScheme(scheme => (scheme === 'light' ? 'dark' : 'light')),
        config,
        updateConfig: patch => setConfig(current => ({ ...current, ...patch })),
        // Wired in the persistence unit; inert defaults for now.
        saveStatus: 'idle',
        lastSavedAt: null,
    };

    return <EditorContext value={value}>{children}</EditorContext>;
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (context === null) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
}
