import { useReceivePreviewState } from "#/features/editor/hooks/use-iframe-message";
import type { PreviewFiles } from "#/features/editor/hooks/use-preview-files-channel";
import { useReceivePreviewFiles } from "#/features/editor/hooks/use-preview-files-channel";
import type { ImageAssetKey } from "#/features/editor/model/assets";
import { imageAssets } from "#/features/editor/model/assets";
import type { PreviewColorScheme, ThemeConfig } from "#/features/editor/model/theme-config";
import { defaultThemeConfig, themeConfigToProperties } from "#/features/editor/model/theme-config";
import { getStory } from "#/features/editor/stories/pages";
import type { PageId } from "#/features/editor/stories/types";
import { KcPage, getKcContextMock } from "@kc-studio/shadcn-theme/preview";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type PreviewSearch = {
    page: PageId;
    story: string;
    scheme: PreviewColorScheme;
    layout: ThemeConfig["layout"];
    base: ThemeConfig["basePalette"];
    accent: ThemeConfig["accent"];
    radius: ThemeConfig["radius"];
    font: ThemeConfig["font"];
    locale: ThemeConfig["locale"];
    placeholders: boolean;
    realmName: boolean;
    logoWhite?: string;
    logoDark?: string;
    sideImage?: string;
    cardBg?: string;
};

/**
 * Isolated preview document, embedded by `PreviewPane` via an iframe.
 *
 * When embedded, all state arrives via `postMessage` and the search params fall
 * back to their defaults. When opened directly in a new tab (the "open in new
 * tab" button), there is no parent to post state, so the initial state is seeded
 * from these search params instead — which also makes the URL shareable.
 */
export const Route = createFileRoute("/preview")({
    validateSearch: (search: Record<string, unknown>): PreviewSearch => ({
        page: (search.page as PageId | undefined) ?? "login.ftl",
        story: (search.story as string | undefined) ?? "default",
        scheme: search.scheme === "dark" ? "dark" : "light",
        layout: (search.layout as ThemeConfig["layout"] | undefined) ?? defaultThemeConfig.layout,
        base:
            (search.base as ThemeConfig["basePalette"] | undefined) ??
            defaultThemeConfig.basePalette,
        accent: (search.accent as ThemeConfig["accent"] | undefined) ?? defaultThemeConfig.accent,
        radius: (search.radius as ThemeConfig["radius"] | undefined) ?? defaultThemeConfig.radius,
        font: (search.font as ThemeConfig["font"] | undefined) ?? defaultThemeConfig.font,
        locale: (search.locale as ThemeConfig["locale"] | undefined) ?? defaultThemeConfig.locale,
        placeholders: search.placeholders !== "false" && search.placeholders !== false,
        realmName: search.realmName !== "false" && search.realmName !== false,
        logoWhite: (search.logoWhite as string | undefined) || undefined,
        logoDark: (search.logoDark as string | undefined) || undefined,
        sideImage: (search.sideImage as string | undefined) || undefined,
        cardBg: (search.cardBg as string | undefined) || undefined,
    }),
    component: PreviewRoute,
});

type IncomingState = {
    pageId: PageId;
    storyId: string;
    colorScheme: PreviewColorScheme;
    config: ThemeConfig;
    files?: PreviewFiles;
};

function PreviewRoute() {
    const search = Route.useSearch();
    const [state, setState] = useState<IncomingState>({
        pageId: search.page,
        storyId: search.story,
        colorScheme: search.scheme,
        config: {
            ...defaultThemeConfig,
            layout: search.layout,
            basePalette: search.base,
            accent: search.accent,
            radius: search.radius,
            font: search.font,
            locale: search.locale,
            showPlaceholders: search.placeholders,
            showRealmName: search.realmName,
            logoWhiteUrl: search.logoWhite ?? "",
            logoDarkUrl: search.logoDark ?? "",
            sideImageUrl: search.sideImage ?? "",
            cardBackgroundUrl: search.cardBg ?? "",
        },
    });

    const { pageId, storyId, colorScheme, config, files } = state;

    // Turn uploaded files into temporary object URLs the iframe can render.
    // `postMessage` structured-clones the File on every state message (even
    // unrelated ones like a slider move), so we key this on a content signature
    // rather than the file reference — otherwise we'd recreate the URLs (and
    // flicker the image) on every keystroke. URLs are owned by this document and
    // revoked on change/unmount.
    const [assetUrls, setAssetUrls] = useState<Partial<Record<ImageAssetKey, string>>>({});
    const filesSignature = imageAssets
        .map(({ key }) => {
            const file = files?.[key];
            return file ? `${key}:${file.name}:${file.size}:${file.lastModified}` : `${key}:`;
        })
        .join("|");

    useEffect(() => {
        const urls: Partial<Record<ImageAssetKey, string>> = {};
        for (const { key } of imageAssets) {
            const file = files?.[key];
            if (file) urls[key] = URL.createObjectURL(file);
        }
        setAssetUrls(urls);
        return () => {
            for (const url of Object.values(urls)) URL.revokeObjectURL(url);
        };
    }, [filesSignature]);

    useReceivePreviewState(receivedState => {
        setState(current => ({ ...current, ...receivedState }));
    });

    useReceivePreviewFiles(receivedFiles => {
        setState(current => ({ ...current, files: receivedFiles }));
    });

    // Apply the editor's color scheme to the iframe document.
    useEffect(() => {
        const root = document.documentElement;
        colorScheme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");

        localStorage.setItem("isDarkMode", colorScheme);
    }, [colorScheme]);

    // Re-resolve the scenario's overrides here (they hold non-cloneable
    // functions, so they can't be sent through `postMessage`)
    const storyOverrides = getStory(pageId, storyId)?.overrides;

    // Resolve theme properties from config, then let any uploaded file override
    // its asset's URL property (file-over-URL, matching the JAR export). A plain
    // `blob:` URL passes through the theme's `resolveAssetUrl` untouched.
    const properties: Record<string, string> = {
        ...storyOverrides?.properties,
        ...themeConfigToProperties(config),
    };
    for (const { key, property } of imageAssets) {
        const url = assetUrls[key];
        if (url) properties[property] = url;
    }

    const kcContext = getKcContextMock({
        pageId,
        overrides: {
            ...storyOverrides,
            locale: {
                ...storyOverrides?.locale,
                currentLanguageTag: config.locale,
            },
            properties,
        },
    });

    return <KcPage key={`${pageId}::${storyId}::${config.locale}`} kcContext={kcContext} />;
}
