import { createContext, use, useState } from "react";

import { useTheme } from "#/components/theme-provider";
import type { ThemeAssetKey } from "../model/assets";
import type { PreviewColorScheme, SaveStatus, ThemeConfig } from "../model/theme-config";
import { defaultThemeConfig } from "../model/theme-config";
import type { Viewport } from "../model/viewport";

export type { ThemeAssetKey };

type EditorContextValue = {
    themeName: string;
    setThemeName: (name: string) => void;
    files: Record<ThemeAssetKey, File | null>;
    setFiles: (files: Record<ThemeAssetKey, File | null>) => void;
    viewport: Viewport;
    setViewport: (viewport: Viewport) => void;
    previewColorScheme: PreviewColorScheme;
    setPreviewColorScheme: (scheme: PreviewColorScheme) => void;
    togglePreviewColorScheme: () => void;
    config: ThemeConfig;
    updateConfig: (patch: Partial<ThemeConfig>) => void;
    readonly resetConfig: () => void;
    saveStatus: SaveStatus;
    lastSavedAt: Date | null;
};

const EditorContext = createContext<EditorContextValue | null>(null);

const emptyFiles: Record<ThemeAssetKey, File | null> = {
    logoWhiteUrl: null,
    logoDarkUrl: null,
    sideImageUrl: null,
    favicon: null,
    cardBackgroundUrl: null,
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const [viewport, setViewport] = useState<Viewport>("desktop");
    const [themeName, setThemeName] = useState<string>("shadcn-theme");
    const [previewColorScheme, setPreviewColorScheme] = useState<PreviewColorScheme>(
        theme as PreviewColorScheme,
    );
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
    const [files, setFiles] = useState<Record<ThemeAssetKey, File | null>>(emptyFiles);

    const value: EditorContextValue = {
        themeName,
        setThemeName,
        viewport,
        setViewport,
        previewColorScheme,
        setPreviewColorScheme,
        files,
        setFiles,
        togglePreviewColorScheme: () =>
            setPreviewColorScheme(scheme => (scheme === "light" ? "dark" : "light")),
        config,
        updateConfig: patch => setConfig(current => ({ ...current, ...patch })),
        resetConfig: () => setConfig(defaultThemeConfig),
        saveStatus: "idle",
        lastSavedAt: null,
    };

    return <EditorContext value={value}>{children}</EditorContext>;
}

export function useEditor() {
    const context = use(EditorContext);
    if (context === null) {
        throw new Error("useEditor must be used within an EditorProvider");
    }
    return context;
}
