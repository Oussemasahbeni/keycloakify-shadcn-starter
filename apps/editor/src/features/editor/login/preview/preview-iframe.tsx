import { getViewportWidth } from "#/features/editor/shared/model/viewport.ts";
import { getPage } from "#/features/editor/login/stories/pages";
import type { PageId } from "#/features/editor/login/stories/types";
import { useEditor } from "#/features/editor/state/editor-context";
import { useState } from "react";
import { usePublishPreview } from "../hooks/use-preview-channel";
import { LoginPreviewToolbar } from "./preview-toolbar";

/**
 * Renders the real theme in an isolated iframe (`/preview`).
 */
export function LoginPreviewIframe() {
    const { viewport, previewColorScheme, config, assets } = useEditor().login;
    const width = getViewportWidth(viewport);

    const [pageId, setPageId] = useState<PageId>("login.ftl");
    const [storyId, setStoryId] = useState("default");

    function handlePageChange(value: PageId) {
        setPageId(value);
        setStoryId(getPage(value)?.stories[0]?.id ?? "default");
    }
    usePublishPreview(pageId, storyId, previewColorScheme, config, assets);

    return (
        <div className="flex h-full flex-col">
            <LoginPreviewToolbar
                pageId={pageId}
                storyId={storyId}
                onPageChange={handlePageChange}
                onStoryChange={setStoryId}
            />
            <div className="bg-muted/30 grid flex-1 place-items-center overflow-auto p-4">
                <iframe
                    src="/preview"
                    title="Theme preview"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    className="bg-background h-full rounded-lg border shadow-sm transition-[width] duration-250"
                    style={{ width: width ? `${width}px` : "100%" }}
                />
            </div>
        </div>
    );
}
