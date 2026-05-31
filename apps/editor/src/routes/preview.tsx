import type { PreviewColorScheme, ThemeConfig } from '#/features/editor/editor-context';
import { defaultThemeConfig } from '#/features/editor/editor-context';
import { getScenario, type PageId } from '#/features/editor/preview-catalog';
import {
    basePalettes,
    radiusPresets,
    themeFontFamilies,
    themePresets,
} from '@kc-studio/shadcn-theme/presets';
import { KcPage, getKcContextMock } from '@kc-studio/shadcn-theme/preview';
import type { ThemeTokens } from '@kc-studio/shadcn-theme/theme-meta';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type CSSProperties } from 'react';

/** Merge the base palette's surfaces with the accent preset's primary tokens. */
function resolveThemeTokens(config: ThemeConfig, mode: PreviewColorScheme): ThemeTokens {
    return {
        ...basePalettes[config.basePalette][mode],
        ...themePresets[config.accent][mode],
    };
}

function camelToKebab(value: string) {
    return value.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);
}

/**
 * Resolved tokens as inline CSS custom properties (`--background`, `--primary`,
 * …). These map onto Tailwind's `--color-*` tokens, so overriding them at
 * runtime re-themes everything inside the container. `--radius` is only set when
 * the preset overrides the default. Font is NOT set here — `--font-sans` is a
 * literal in `@theme inline`, so the preview applies `fontFamily` directly.
 */
function themeConfigToCssVars(config: ThemeConfig, mode: PreviewColorScheme): CSSProperties {
    const tokens = resolveThemeTokens(config, mode);
    const vars: Record<string, string> = {};

    for (const [key, value] of Object.entries(tokens)) {
        vars[`--${camelToKebab(key)}`] = value;
    }

    const radius = radiusPresets[config.radius];
    if (radius !== undefined) {
        vars['--radius'] = radius;
    }

    return vars;
}

/**
 * Isolated preview document, embedded by `PreviewPane` via an iframe.
 *
 * Driven entirely by `postMessage` from the editor — no URL params, no reloads
 * (page switches just re-render). Theming is applied two ways:
 *   - colors + radius: `themeConfigToCssVars` injected onto this document's
 *     `:root` as inline styles (overrides the theme's own `useApplyThemePreset`).
 *   - layout: passed through the mock `kcContext.properties.SHADCN_THEME_LAYOUT`.
 *
 * `ssr: false` because `KcPage` touches `document` on mount.
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

    // Receive editor state. Announce readiness so the parent (re)sends the
    // current state even if it posted before this listener was attached.
    useEffect(() => {
        function onMessage(event: MessageEvent) {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data?.type === 'kc-preview:state') {
                setState(current => ({ ...current, ...event.data.payload }));
            }
        }

        window.addEventListener('message', onMessage);
        window.parent?.postMessage({ type: 'kc-preview:ready' }, window.location.origin);

        return () => window.removeEventListener('message', onMessage);
    }, []);

    const { pageId, scenarioId, colorScheme, config } = state;

    // Apply color scheme + resolved tokens to this iframe's document root.
    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle('dark', colorScheme === 'dark');
        root.classList.toggle('light', colorScheme === 'light');

        const vars = themeConfigToCssVars(config, colorScheme) as Record<string, string>;
        for (const [name, value] of Object.entries(vars)) {
            root.style.setProperty(name, value);
        }

        document.body.style.fontFamily = themeFontFamilies[config.font];
    }, [config, colorScheme]);

    // Re-resolve the scenario's overrides here (they hold non-cloneable
    // functions, so they can't be sent through `postMessage`). The editor's
    // live `layout` is layered on top via the theme's own properties channel.
    const scenarioOverrides = getScenario(pageId, scenarioId)?.overrides;
    const kcContext = getKcContextMock({
        pageId,
        overrides: {
            ...scenarioOverrides,
            properties: { ...scenarioOverrides?.properties, SHADCN_THEME_LAYOUT: config.layout },
        },
    });

    return <KcPage kcContext={kcContext} />;
}
