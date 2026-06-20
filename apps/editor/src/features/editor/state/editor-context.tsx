import { createContext, use, useState } from "react";

import type { PreviewColorScheme, SaveStatus, ThemeConfig } from "../model/theme-config";
import { defaultThemeConfig } from "../model/theme-config";
import type { Viewport } from "../model/viewport";

type EditorContextValue = {
    themeName: string;
    setThemeName: (name: string) => void;
    /** Uploaded favicon (PNG/SVG/ICO) baked into the exported JAR; not previewed live. */
    favicon: File | null;
    setFavicon: (file: File | null) => void;
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

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const [viewport, setViewport] = useState<Viewport>("desktop");
    const [themeName, setThemeName] = useState<string>("shadcn-theme");
    const [favicon, setFavicon] = useState<File | null>(null);
    const [previewColorScheme, setPreviewColorScheme] = useState<PreviewColorScheme>("light");
    const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);

    const value: EditorContextValue = {
        themeName,
        setThemeName,
        favicon,
        setFavicon,
        viewport,
        setViewport,
        previewColorScheme,
        setPreviewColorScheme,
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
