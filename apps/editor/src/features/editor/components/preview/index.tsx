import { useRef, useState } from "react";
import { usePushPreviewState } from "../../hooks/use-iframe-message";
import { usePublishPreviewAssets } from "../../hooks/use-preview-assets-channel";
import { getViewportWidth } from "../../model/viewport";
import { useEditor } from "../../state/editor-context";
import { getPage } from "../../stories/pages";
import type { PageId } from "../../stories/types";
import { PreviewToolbar } from "./preview-toolbar";

/**
 * Renders the real theme in an isolated iframe (`/preview`).
 */
export function PreviewPane() {
    const { viewport, previewColorScheme, config, assets } = useEditor();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const width = getViewportWidth(viewport);

    const [pageId, setPageId] = useState<PageId>("login.ftl");
    const [storyId, setStoryId] = useState("default");

    function handlePageChange(value: PageId) {
        setPageId(value);
        setStoryId(getPage(value)?.stories[0]?.id ?? "default");
    }

    usePushPreviewState(iframeRef, pageId, storyId, previewColorScheme, config);
    usePublishPreviewAssets(assets);

    return (
        <div className="flex h-full flex-col">
            <PreviewToolbar
                pageId={pageId}
                storyId={storyId}
                onPageChange={handlePageChange}
                onStoryChange={setStoryId}
            />
            <div className="bg-muted/30 grid flex-1 place-items-center overflow-auto p-4">
                <iframe
                    ref={iframeRef}
                    src="/preview"
                    title="Theme preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    className="bg-background h-full rounded-lg border shadow-sm transition-[width] duration-250"
                    style={{ width: width ? `${width}px` : "100%" }}
                />
            </div>
        </div>
    );
}
