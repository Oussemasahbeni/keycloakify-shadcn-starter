import { Spinner } from "#/components/ui/spinner";
import { useReceivePreviewState } from "#/features/editor/login/hooks/use-iframe-message";
import type { PreviewAssets } from "#/features/editor/login/hooks/use-preview-assets-channel";
import { useReceivePreviewAssets } from "#/features/editor/login/hooks/use-preview-assets-channel";

import type { AssetKey } from "#/features/editor/login/model/assets.ts";
import { assetDefinitions } from "#/features/editor/login/model/assets.ts";
import type { PreviewColorScheme, LoginThemeConfig } from "#/features/editor/login/model/theme-config";
import {
    defaultLoginThemeConfig,
    themeConfigToProperties,
} from "#/features/editor/login/model/theme-config";
import { getStory } from "#/features/editor/login/stories/pages";
import type { PageId } from "#/features/editor/login/stories/types";

import { KcPage, getKcContextMock } from "@kc-studio/shadcn-theme/preview";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type PreviewSearch = {
    page: PageId;
    story: string;
    scheme: PreviewColorScheme;
    layout: LoginThemeConfig["layout"];
    base: LoginThemeConfig["basePalette"];
    accent: LoginThemeConfig["accent"];
    radius: LoginThemeConfig["radius"];
    font: LoginThemeConfig["font"];
    locale: LoginThemeConfig["locale"];
    sidePanelPosition: LoginThemeConfig["sidePanelPosition"];
    showPlaceholder: boolean;
    realmName: boolean;
    logo?: string;
    logoDark?: string;
    asideImage?: string;
    cardImage?: string;
    sidePanelImage?: string;
    sidePanelImageDark?: string;
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
        layout: (search.layout as LoginThemeConfig["layout"] | undefined) ?? defaultLoginThemeConfig.layout,
        base:
            (search.base as LoginThemeConfig["basePalette"] | undefined) ??
            defaultLoginThemeConfig.basePalette,
        accent: (search.accent as LoginThemeConfig["accent"] | undefined) ?? defaultLoginThemeConfig.accent,
        radius: (search.radius as LoginThemeConfig["radius"] | undefined) ?? defaultLoginThemeConfig.radius,
        font: (search.font as LoginThemeConfig["font"] | undefined) ?? defaultLoginThemeConfig.font,
        locale: (search.locale as LoginThemeConfig["locale"] | undefined) ?? defaultLoginThemeConfig.locale,
        sidePanelPosition: search.sidePanelPosition === "left" ? "left" : "right",
        showPlaceholder: search.showPlaceholder !== "false" && search.showPlaceholder !== false,
        realmName: search.realmName !== "false" && search.realmName !== false,
        logo: (search.logo as string | undefined) || undefined,
        logoDark: (search.logoDark as string | undefined) || undefined,
        asideImage: (search.asideImage as string | undefined) || undefined,
        cardImage: (search.cardImage as string | undefined) || undefined,
        sidePanelImage: (search.sidePanelImage as string | undefined) || undefined,
        sidePanelImageDark: (search.sidePanelImageDark as string | undefined) || undefined,
    }),
    ssr: false,
    component: PreviewRoute,
    pendingComponent: () => (
        <div className="text-muted-foreground flex h-svh items-center justify-center gap-2 text-sm">
            <Spinner className="size-4" />
            <span>Loading preview…</span>
        </div>
    ),
});

type IncomingState = {
    pageId: PageId;
    storyId: string;
    colorScheme: PreviewColorScheme;
    config: LoginThemeConfig;
    assets?: PreviewAssets;
};

function PreviewRoute() {
    const search = Route.useSearch();
    const [state, setState] = useState<IncomingState>({
        pageId: search.page,
        storyId: search.story,
        colorScheme: search.scheme,
        config: {
            ...defaultLoginThemeConfig,
            layout: search.layout,
            basePalette: search.base,
            accent: search.accent,
            radius: search.radius,
            font: search.font,
            locale: search.locale,
            sidePanelPosition: search.sidePanelPosition,
            showPlaceholder: search.showPlaceholder,
            showRealmName: search.realmName,
            logoUrl: search.logo ?? "",
            logoDarkUrl: search.logoDark ?? "",
            asideImageUrl: search.asideImage ?? "",
            cardImageUrl: search.cardImage ?? "",
            sidePanelImageUrl: search.sidePanelImage ?? "",
            sidePanelImageDarkUrl: search.sidePanelImageDark ?? "",
        },
    });

    const { pageId, storyId, colorScheme, config, assets } = state;

    const [assetUrls, setAssetUrls] = useState<Partial<Record<AssetKey, string>>>({});

    useEffect(() => {
        const urls: Partial<Record<AssetKey, string>> = {};
        for (const { key } of assetDefinitions) {
            const file = assets?.[key];
            if (file) urls[key] = URL.createObjectURL(file);
        }
        setAssetUrls(urls);
        return () => {
            for (const url of Object.values(urls)) URL.revokeObjectURL(url);
        };
    }, [assets]);

    useReceivePreviewState(receivedState => {
        setState(current => ({ ...current, ...receivedState }));
    });

    useReceivePreviewAssets(receivedAssets => {
        setState(current => ({ ...current, assets: receivedAssets }));
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

    const uploadedAssetProperties: Record<string, string> = {};
    for (const { key, property } of assetDefinitions) {
        const url = assetUrls[key];
        if (url) uploadedAssetProperties[property] = url;
    }

    const kcContext = getKcContextMock({
        pageId,
        overrides: {
            ...storyOverrides,
            locale: {
                ...storyOverrides?.locale,
                currentLanguageTag: config.locale,
            },
            properties: {
                ...storyOverrides?.properties,
                ...themeConfigToProperties(config),
                ...uploadedAssetProperties,
            },
        },
    });

    return <KcPage key={`${pageId}::${storyId}::${config.locale}`} kcContext={kcContext} />;
}
