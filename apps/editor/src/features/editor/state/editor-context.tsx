import { createContext, use, useState } from "react";

import { useTheme } from "#/components/theme-provider";
import type { EmailTemplate } from "@kc-studio/shadcn-theme/email";
import { emailTemplates } from "@kc-studio/shadcn-theme/email";
import type { EmailThemeConfig } from "../email/model/theme-config";
import { defaultEmailThemeConfig } from "../email/model/theme-config";
import type { ThemeAssetKey } from "../login/model/assets";
import type { LoginThemeConfig, PreviewColorScheme } from "../login/model/theme-config";
import { defaultLoginThemeConfig } from "../login/model/theme-config";
import type { Viewport } from "../login/model/viewport";
import type { Surface } from "../shared/components/surface-switch";

interface EditorContextValue {
    themeName: string;
    setThemeName: (name: string) => void;
    activeSurface: Surface;
    setActiveSurface: (s: Surface) => void;
    readonly resetConfig: () => void;
    login: {
        config: LoginThemeConfig;
        updateConfig: (patch: Partial<LoginThemeConfig>) => void;
        previewColorScheme: PreviewColorScheme;
        setPreviewColorScheme: (scheme: PreviewColorScheme) => void;
        togglePreviewColorScheme: () => void;
        viewport: Viewport;
        setViewport: (viewport: Viewport) => void;
        assets: Record<ThemeAssetKey, File | null>;
        setAssets: (assets: Record<ThemeAssetKey, File | null>) => void;
    };
    email: {
        config: EmailThemeConfig;
        updateConfig: (patch: Partial<EmailThemeConfig>) => void;
        template: EmailTemplate;
        setTemplate: (template: EmailTemplate) => void;
    };
}

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
    const [activeSurface, setActiveSurface] = useState<Surface>("login");
    const [previewColorScheme, setPreviewColorScheme] = useState<PreviewColorScheme>(theme as PreviewColorScheme);
    const [loginThemeConfig, setLoginThemeConfig] = useState<LoginThemeConfig>(defaultLoginThemeConfig);
    const [emailThemeConfig, setEmailThemeConfig] = useState<EmailThemeConfig>(defaultEmailThemeConfig);
    const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>(emailTemplates[0]);
    const [assets, setAssets] = useState<Record<ThemeAssetKey, File | null>>(emptyAssets);

    const value: EditorContextValue = {
        themeName,
        setThemeName,
        activeSurface,
        setActiveSurface,
        resetConfig: () => {
            setLoginThemeConfig(defaultLoginThemeConfig);
            setEmailThemeConfig(defaultEmailThemeConfig);
            setAssets(emptyAssets);
        },

        login: {
            viewport,
            setViewport,
            previewColorScheme,
            setPreviewColorScheme,
            config: loginThemeConfig,
            updateConfig: patch => setLoginThemeConfig(current => ({ ...current, ...patch })),
            togglePreviewColorScheme: () => setPreviewColorScheme(scheme => (scheme === "light" ? "dark" : "light")),
            assets: assets,
            setAssets: setAssets,
        },
        email: {
            config: emailThemeConfig,
            updateConfig: patch => setEmailThemeConfig(current => ({ ...current, ...patch })),
            template: emailTemplate,
            setTemplate: setEmailTemplate,
        },
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
