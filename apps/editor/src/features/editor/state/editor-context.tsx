import { createContext, use, useState } from "react";

import { useTheme } from "#/components/theme-provider";
import type { EmailTemplate } from "@kc-studio/shadcn-theme/email";
import { emailTemplates } from "@kc-studio/shadcn-theme/email";
import type { ThemeAssetKey } from "../shared/model/assets";
import { emptyAssets } from "../shared/model/assets";

import { BASE_THEME_NAME } from "../shared/constants";
import type { PreviewColorScheme } from "../shared/model/preview-color-scheme";
import type { Surface } from "../shared/model/surface";
import type { EmailThemeConfig, LoginThemeConfig } from "../shared/model/theme-config";
import { defaultLoginThemeConfig } from "../shared/model/theme-config";
import type { Viewport } from "../shared/model/viewport";
import type { ParsedTheme } from "../shared/parse-theme-jar";

interface EditorContextValue {
    themeName: string;
    setThemeName: (name: string) => void;
    activeSurface: Surface;
    setActiveSurface: (s: Surface) => void;
    readonly resetConfig: () => void;
    readonly importTheme: (state: ParsedTheme) => void;
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
        emailLogoFile: File | null;
        setEmailLogoFile: (file: File | null) => void;
    };
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const [viewport, setViewport] = useState<Viewport>("desktop");
    const [themeName, setThemeName] = useState<string>(BASE_THEME_NAME);
    const [activeSurface, setActiveSurface] = useState<Surface>("login");
    const [previewColorScheme, setPreviewColorScheme] = useState<PreviewColorScheme>(theme as PreviewColorScheme);
    const [loginThemeConfig, setLoginThemeConfig] = useState<LoginThemeConfig>(defaultLoginThemeConfig);
    const [emailThemeConfig, setEmailThemeConfig] = useState<EmailThemeConfig>({});
    const [emailTemplate, setEmailTemplate] = useState<EmailTemplate>(emailTemplates[0]);
    const [assets, setAssets] = useState<Record<ThemeAssetKey, File | null>>(emptyAssets);
    const [emailLogoFile, setEmailLogoFile] = useState<File | null>(null);

    const value: EditorContextValue = {
        themeName,
        setThemeName,
        activeSurface,
        setActiveSurface,
        resetConfig: () => {
            setLoginThemeConfig(defaultLoginThemeConfig);
            setEmailThemeConfig({});
            setAssets(emptyAssets);
            setEmailLogoFile(null);
        },
        importTheme: state => {
            setThemeName(state.themeName);
            setLoginThemeConfig(current => ({ ...state.login, locale: current.locale }));
            setAssets(state.assets);
            setEmailThemeConfig(state.email);
            setEmailLogoFile(state.emailLogoFile);
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
            emailLogoFile,
            setEmailLogoFile,
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
