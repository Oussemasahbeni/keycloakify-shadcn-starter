import { Spinner } from "#/components/ui/spinner";
import type { PreviewAssets, PreviewState } from "#/features/editor/login/hooks/use-preview-channel.ts";
import { useReceivePreview } from "#/features/editor/login/hooks/use-preview-channel.ts";

import type { AssetKey } from "#/features/editor/shared/model/assets.ts";
import { assetDefinitions } from "#/features/editor/shared/model/assets.ts";
import { getStory } from "#/features/editor/login/stories/pages";

import { KcPage, getKcContextMock } from "@kc-studio/shadcn-theme/preview";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { defaultLoginThemeConfig, themeConfigToProperties } from '#/features/editor/shared/model/theme-config.ts';

/**
 * Isolated preview document, embedded by `PreviewPane` via an iframe.
 */
export const Route = createFileRoute("/preview")({
    ssr: false,
    component: PreviewRoute,
    pendingComponent: () => (
        <div className="text-muted-foreground flex h-svh items-center justify-center gap-2 text-sm">
            <Spinner className="size-4" />
            <span>Loading preview…</span>
        </div>
    ),
});

function PreviewRoute() {
    const [state, setState] = useState<PreviewState & { assets?: PreviewAssets }>({
        pageId: "login.ftl",
        storyId: "default",
        colorScheme: "light",
        config: defaultLoginThemeConfig,
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

    useReceivePreview({
        onState: incoming => setState(current => ({ ...current, ...incoming })),
        onAssets: incoming => setState(current => ({ ...current, assets: incoming })),
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
