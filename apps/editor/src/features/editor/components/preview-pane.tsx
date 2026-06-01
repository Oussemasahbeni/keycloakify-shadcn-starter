import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '#/components/ui/select';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getViewportWidth, VIEWPORTS } from '../model/viewport';
import type { PageId } from '../stories/pages';
import { getGroupedPages, getPage } from '../stories/pages';
import { useEditor } from '../state/editor-context';

import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip';

import { Button } from '#/components/ui/button';
import { Globe, Moon, Sun } from 'lucide-react';
import type { Locale } from '../model/locales';
import { supportedLocales } from '../model/locales';

function ViewportToggle() {
    const { viewport, setViewport } = useEditor();

    return (
        <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
            {VIEWPORTS.map(({ id, label, icon: Icon }) => {
                const isActive = viewport === id;
                return (
                    <Tooltip key={id}>
                        <TooltipTrigger
                            render={
                                <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    size="icon"
                                    className="size-8"
                                    aria-pressed={isActive}
                                    onClick={() => setViewport(id)}
                                >
                                    <Icon className="size-4" />
                                    <span className="sr-only">{label}</span>
                                </Button>
                            }
                        />
                        <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                );
            })}
        </div>
    );
}

function PreviewThemeToggle() {
    const { previewColorScheme, setPreviewColorScheme } = useEditor();

    return (
        <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant={previewColorScheme === 'light' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="size-8"
                            aria-pressed={previewColorScheme === 'light'}
                            onClick={() => setPreviewColorScheme('light')}
                        >
                            <Sun className="size-4" />
                            <span className="sr-only">Light</span>
                        </Button>
                    }
                />
                <TooltipContent>Light</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant={previewColorScheme === 'dark' ? 'secondary' : 'ghost'}
                            size="icon"
                            className="size-8"
                            aria-pressed={previewColorScheme === 'dark'}
                            onClick={() => setPreviewColorScheme('dark')}
                        >
                            <Moon className="size-4" />
                            <span className="sr-only">Dark</span>
                        </Button>
                    }
                />
                <TooltipContent>Dark</TooltipContent>
            </Tooltip>
        </div>
    );
}

function LanguageSelect() {
    const { config, updateConfig } = useEditor();
    const labelFor = (locale: Locale) =>
        supportedLocales.find(entry => entry.value === locale)?.label ?? locale;

    return (
        <Select
            value={config.locale}
            onValueChange={value => updateConfig({ locale: value as Locale })}
        >
            <SelectTrigger className="w-64">
                <Globe className="size-4 text-muted-foreground" />
                <SelectValue>{(selected: Locale) => labelFor(selected)}</SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className={'max-h-100'}>
                {supportedLocales.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/**
 * Renders the real theme in an isolated iframe (`/preview`). The editor's
 * `config` / `previewColorScheme` / selected page are pushed in via
 * `postMessage`; `viewport` clamps the iframe width. The iframe is never
 * reloaded — page switches re-render `KcPage` on the other side.
 */
export function PreviewPane() {
    const { viewport, previewColorScheme, config } = useEditor();
    const [pageId, setPageId] = useState<PageId>('login.ftl');
    const [storyId, setStoryId] = useState('default');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const width = getViewportWidth(viewport);

    const stories = getPage(pageId)?.stories ?? [];

    // Switching page resets to that page's first (default) scenario, since
    // scenario ids are only unique within a page.µ/
    function handlePageChange(value: PageId) {
        setPageId(value);
        setStoryId(getPage(value)?.stories[0]?.id ?? 'default');
    }

    const postState = useCallback(() => {
        iframeRef.current?.contentWindow?.postMessage(
            {
                type: 'kc-preview:state',
                payload: { pageId, scenarioId: storyId, colorScheme: previewColorScheme, config },
            },
            window.location.origin,
        );
    }, [pageId, storyId, previewColorScheme, config]);

    // Push state on every editor change.
    useEffect(() => {
        postState();
    }, [postState]);

    // Push state again when the iframe mounts and announces it's listening.
    useEffect(() => {
        function onMessage(event: MessageEvent) {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data.type === 'kc-preview:ready') {
                postState();
            }
        }

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [postState]);

    return (
        <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2 border-b p-2">
                <Select value={pageId} onValueChange={value => handlePageChange(value as PageId)}>
                    <SelectTrigger className="w-64">
                        <SelectValue>
                            {(value: PageId) => getPage(value)?.label ?? value}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false} className={'max-h-100'}>
                        {getGroupedPages().map(group => (
                            <SelectGroup key={group.id}>
                                <SelectLabel>{group.label}</SelectLabel>
                                {group.pages.map(page => (
                                    <SelectItem key={page.pageId} value={page.pageId}>
                                        {page.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        ))}
                    </SelectContent>
                </Select>

                {stories.length > 1 && (
                    <Select
                        value={storyId}
                        onValueChange={value => setStoryId(value ?? 'default')}
                    >
                        <SelectTrigger className="w-56">
                            <SelectValue>
                                {(value: string) =>
                                    stories.find(scenario => scenario.id === value)?.label ??
                                    value
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false} className={'max-h-100'}>
                            {stories.map(scenario => (
                                <SelectItem key={scenario.id} value={scenario.id}>
                                    {scenario.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                <LanguageSelect />
                <ViewportToggle />
                <PreviewThemeToggle />

                {/* TODO: add  open in isolation mode button*/}
            </div>
            <div className="grid min-h-0 flex-1 place-items-center overflow-auto bg-muted/30 p-4">
                <iframe
                    ref={iframeRef}
                    src="/preview"
                    title="Theme preview"
                    className="h-full rounded-lg border bg-background shadow-sm transition-[width] duration-250"
                    style={{ width: width ? `${width}px` : '100%' }}
                />
            </div>
        </div>
    );
}
