import type { PreviewColorScheme, ThemeConfig } from '#/features/editor/editor-context';
import { defaultThemeConfig } from '#/features/editor/editor-context';
import { getScenario, type PageId } from '#/features/editor/preview-catalog';
import { KcPage, getKcContextMock } from '@kc-studio/shadcn-theme/preview';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

/**
 * Isolated preview document, embedded by `PreviewPane` via an iframe.
 */
export const Route = createFileRoute('/preview')({
    ssr: false,
    component: PreviewRoute,
});

type IncomingState = {
    pageId: PageId;
    scenarioId: string;
    colorScheme: PreviewColorScheme;
    config: ThemeConfig;
};

function PreviewRoute() {
    const [state, setState] = useState<IncomingState>({
        pageId: 'login.ftl' as PageId,
        scenarioId: 'default',
        colorScheme: 'light',
        config: defaultThemeConfig,
    });

    const { pageId, scenarioId, colorScheme, config } = state;

    // Receive editor state. Announce readiness so the parent (re)sends the
    // current state even if it posted before this listener was attached.
    useEffect(() => {
        function onMessage(event: MessageEvent) {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data.type === 'kc-preview:state') {
                setState(current => ({ ...current, ...event.data.payload }));
            }
        }

        window.addEventListener('message', onMessage);
        window.parent?.postMessage({ type: 'kc-preview:ready' }, window.location.origin);

        return () => window.removeEventListener('message', onMessage);
    }, []);

    // Apply the editor's color scheme to the iframe document.
    useEffect(() => {
        const isDark = colorScheme === 'dark';
        const root = document.documentElement;

        root.classList.toggle('dark', isDark);
        root.classList.toggle('light', !isDark);
        // We toggle the class for the current render AND persist the choice to the
        // theme's own `localStorage["isDarkMode"]`. The theme's ThemeProvider reads
        // that key *first* on every mount (falling back to the OS preference), and
        // the `key={config.locale}` below remounts it on a language change — so
        // without persisting, switching language re-runs ThemeProvider and snaps the
        // preview back to the OS scheme. Writing the key it checks first makes the
        // remount initialize to the editor's scheme instead.
        localStorage.setItem('isDarkMode', colorScheme);
    }, [colorScheme]);

    // Re-resolve the scenario's overrides here (they hold non-cloneable
    // functions, so they can't be sent through `postMessage`)
    const scenarioOverrides = getScenario(pageId, scenarioId)?.overrides;
    const kcContext = getKcContextMock({
        pageId,
        overrides: {
            ...scenarioOverrides,
            locale: {
                ...scenarioOverrides?.locale,
                currentLanguageTag: config.locale,
            },
            properties: {
                ...scenarioOverrides?.properties,
                SHADCN_THEME_LAYOUT: config.layout,
                SHADCN_THEME_BASE: config.basePalette,
                SHADCN_THEME_PRESET: config.accent,
                SHADCN_THEME_RADIUS: config.radius,
                SHADCN_THEME_FONT: config.font,
                SHADCN_THEME_PLACEHOLDER: config.showPlaceholders ? 'true' : 'false',
            },
        },
    });

    return <KcPage key={`${pageId}::${scenarioId}::${config.locale}`} kcContext={kcContext} />;
}
