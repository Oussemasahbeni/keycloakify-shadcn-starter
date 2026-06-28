import { createContext, use, useState } from "react";

import { useTheme } from "#/components/theme-provider";
import type { ThemeAssetKey } from "../model/assets";
import type { PreviewColorScheme, SaveStatus, ThemeConfig } from "../model/theme-config";
import { defaultThemeConfig } from "../model/theme-config";
import type { Viewport } from "../model/viewport";

type EditorContextValue = {
    themeName: string;
    setThemeName: (name: string) => void;
    assets: Record<ThemeAssetKey, File | null>;
    setAssets: (assets: Record<ThemeAssetKey, File | null>) => void;
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

const emptyAssets: Record<ThemeAssetKey, File | null> = {
    logoUrl: null,
    logoDarkUrl: null,
    asideImageUrl: null,
    favicon: null,
    cardImageUrl: null,
    sidePanelImageUrl: null,
    sidePanelImageDarkUrl: null,
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const [viewport, setViewport] = useState<Viewport>("desktop");
    const [themeName, setThemeName] = useState<string>("shadcn-theme");
    const [previewColorScheme, setPreviewColorScheme] = useState<PreviewColorScheme>(
        theme as PreviewColorScheme,
    );
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
    const [assets, setAssets] = useState<Record<ThemeAssetKey, File | null>>(emptyAssets);

    const value: EditorContextValue = {
        themeName,
        setThemeName,
        viewport,
        setViewport,
        previewColorScheme,
        setPreviewColorScheme,
        assets: assets,
        setAssets: setAssets,
        togglePreviewColorScheme: () =>
            setPreviewColorScheme(scheme => (scheme === "light" ? "dark" : "light")),
        config,
        updateConfig: patch => setConfig(current => ({ ...current, ...patch })),
        resetConfig: () => {
            setConfig(defaultThemeConfig);
            setAssets(emptyAssets);
        },
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
