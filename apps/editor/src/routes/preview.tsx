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
    // Optional: omitted (undefined) when unset so the router doesn't serialize
    // empty `logoWhite=&logoDark=&…` params into the URL.
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
    ssr: false,
    component: PreviewRoute,
    pendingComponent: () => (
        <div className="flex h-full items-center justify-center">Loading preview...</div>
    ),
});

type IncomingState = {
    pageId: PageId;
    storyId: string;
    colorScheme: PreviewColorScheme;
    config: ThemeConfig;
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

    const { pageId, storyId, colorScheme, config } = state;

    // Receive editor state. Announce readiness so the parent (re)sends the
    // current state even if it posted before this listener was attached.
    useEffect(() => {
        function onMessage(event: MessageEvent) {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data.type === "kc-preview:state") {
                setState(current => ({ ...current, ...event.data.payload }));
            }
        }

        window.addEventListener("message", onMessage);
        window.parent.postMessage({ type: "kc-preview:ready" }, window.location.origin);

        return () => window.removeEventListener("message", onMessage);
    }, []);

    // Apply the editor's color scheme to the iframe document.
    useEffect(() => {
        const isDark = colorScheme === "dark";
        const root = document.documentElement;

        root.classList.toggle("dark", isDark);
        root.classList.toggle("light", !isDark);
        // We toggle the class for the current render AND persist the choice to the
        // theme's own `localStorage["isDarkMode"]`. The theme's ThemeProvider reads
        // that key *first* on every mount (falling back to the OS preference), and
        // the `key={config.locale}` below remounts it on a language change — so
        // without persisting, switching language re-runs ThemeProvider and snaps the
        // preview back to the OS scheme. Writing the key it checks first makes the
        // remount initialize to the editor's scheme instead.
        localStorage.setItem("isDarkMode", colorScheme);
    }, [colorScheme]);

    // Re-resolve the scenario's overrides here (they hold non-cloneable
    // functions, so they can't be sent through `postMessage`)
    const storyOverrides = getStory(pageId, storyId)?.overrides;
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
            },
        },
    });

    return <KcPage key={`${pageId}::${storyId}::${config.locale}`} kcContext={kcContext} />;
}
