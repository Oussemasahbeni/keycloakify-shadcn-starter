import { Button } from "#/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/components/ui/tooltip";

import { ButtonGroup } from "#/components/ui/button-group";
import { ExternalLink, RotateCcw } from "lucide-react";
import { SCHEMES } from "../../model/theme-config";
import { VIEWPORTS } from "../../model/viewport";
import { useEditor } from "../../state/editor-context";
import type { PageId } from "../../stories/types";
import { LanguageSelect } from "./language-select";
import { PageSelect } from "./page-select";

function ViewportToggle() {
    const { viewport, setViewport } = useEditor();

    return (
        <ButtonGroup>
            {VIEWPORTS.map(({ id, label, icon: Icon }) => {
                const isActive = viewport === id;
                return (
                    <Tooltip key={id}>
                        <TooltipTrigger
                            render={
                                <Button
                                    variant={isActive ? "default" : "outline"}
                                    size="icon"
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
        </ButtonGroup>
    );
}

function PreviewThemeToggle() {
    const { previewColorScheme, setPreviewColorScheme } = useEditor();

    return (
        <ButtonGroup>
            {SCHEMES.map(({ value: scheme, label, icon: Icon }) => (
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <Button
                                variant={previewColorScheme === scheme ? "default" : "outline"}
                                size="icon"
                                aria-pressed={previewColorScheme === scheme}
                                onClick={() => setPreviewColorScheme(scheme)}
                            >
                                <Icon />
                                <span className="sr-only">{label}</span>
                            </Button>
                        }
                    />
                    <TooltipContent>{label}</TooltipContent>
                </Tooltip>
            ))}
        </ButtonGroup>
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
            sidePanelPosition: config.sidePanelPosition,
            showPlaceholder: String(config.showPlaceholder),
            realmName: String(config.showRealmName),
            logo: config.logoUrl,
            logoDark: config.logoDarkUrl,
            asideImage: config.asideImageUrl,
            cardImage: config.cardImageUrl,
            sidePanelImage: config.sidePanelImageUrl,
            sidePanelImageDark: config.sidePanelImageDarkUrl,
        });
        window.open(`/preview?${params.toString()}`, "_blank", "noopener");
    }

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button variant="outline" size="icon" onClick={openInNewTab}>
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
                    <Button variant="outline" size="icon" onClick={resetConfig}>
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
