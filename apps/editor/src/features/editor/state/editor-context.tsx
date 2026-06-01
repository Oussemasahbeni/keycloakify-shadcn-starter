import { createContext, useContext, useState } from 'react';

import type { PreviewColorScheme, SaveStatus, ThemeConfig } from '../model/theme-config';
import { defaultThemeConfig } from '../model/theme-config';
import type { Viewport } from '../model/viewport';

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
