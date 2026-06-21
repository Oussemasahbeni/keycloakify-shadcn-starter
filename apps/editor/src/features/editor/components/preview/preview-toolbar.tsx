import { Button } from "#/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip";

import { ExternalLink, Moon, RotateCcw, Sun } from "lucide-react";
import { VIEWPORTS } from "../../model/viewport";
import { useEditor } from "../../state/editor-context";
import type { PageId } from "../../stories/types";
import { LanguageSelect } from "./language-select";
import { PageSelect } from "./page-select";

function ViewportToggle() {
    const { viewport, setViewport } = useEditor();

    return (
        <div className="bg-background flex items-center gap-1 rounded-lg border p-1">
            {VIEWPORTS.map(({ id, label, icon: Icon }) => {
                const isActive = viewport === id;
                return (
                    <Tooltip key={id}>
                        <TooltipTrigger
                            render={
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
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
        <div className="bg-background flex items-center gap-1 rounded-lg border p-1">
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant={previewColorScheme === "light" ? "secondary" : "ghost"}
                            size="icon"
                            className="size-8"
                            aria-pressed={previewColorScheme === "light"}
                            onClick={() => setPreviewColorScheme("light")}
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
                            variant={previewColorScheme === "dark" ? "secondary" : "ghost"}
                            size="icon"
                            className="size-8"
                            aria-pressed={previewColorScheme === "dark"}
                            onClick={() => setPreviewColorScheme("dark")}
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

function PreviewInNewTab({ pageId, storyId }: { pageId: PageId; storyId: string }) {
    const { config, previewColorScheme } = useEditor();

    function openInNewTab() {
        const params = new URLSearchParams({
            page: pageId,
            story: storyId,
            scheme: previewColorScheme,
            layout: config.layout,
            base: config.basePalette,
            accent: config.accent,
            radius: config.radius,
            font: config.font,
            locale: config.locale,
            placeholders: String(config.showPlaceholders),
            realmName: String(config.showRealmName),
        });

        // Image URLs are optional — only include the ones that are set so the
        // URL stays clean (the preview defaults empty params to '' anyway).
        const imageParams = {
            logoWhite: config.logoWhiteUrl,
            logoDark: config.logoDarkUrl,
            sideImage: config.sideImageUrl,
            cardBg: config.cardBackgroundUrl,
        };
        for (const [key, value] of Object.entries(imageParams)) {
            if (value) {
                params.set(key, value);
            }
        }

        window.open(`/preview?${params.toString()}`, "_blank", "noopener");
    }

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button variant="outline" size="icon" className="size-8" onClick={openInNewTab}>
                        <ExternalLink />
                    </Button>
                }
            />
            <TooltipContent>Open full page in new tab</TooltipContent>
        </Tooltip>
    );
}

function ResetButton() {
    const { resetConfig } = useEditor();

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button variant="outline" size="icon" className="size-8" onClick={resetConfig}>
                        <RotateCcw />
                    </Button>
                }
            />
            <TooltipContent>Reset configuration</TooltipContent>
        </Tooltip>
    );
}

type PreviewToolbarProps = {
    pageId: PageId;
    storyId: string;
    onPageChange: (pageId: PageId) => void;
    onStoryChange: (storyId: string) => void;
};

export function PreviewToolbar({
    pageId,
    storyId,
    onPageChange,
    onStoryChange,
}: PreviewToolbarProps) {
    return (
        <div className="flex items-center justify-between gap-2 border-b p-2">
            <div className="flex items-center gap-2">
                <PageSelect
                    pageId={pageId}
                    storyId={storyId}
                    onPageChange={onPageChange}
                    onStoryChange={onStoryChange}
                />
                <LanguageSelect />
                <ViewportToggle />
                <PreviewThemeToggle />
            </div>

            <div className="flex items-center gap-2">
                <PreviewInNewTab pageId={pageId} storyId={storyId} />
                <ResetButton />
            </div>
        </div>
    );
}
