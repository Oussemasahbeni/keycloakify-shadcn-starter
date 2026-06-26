import type { RefObject } from "react";
import { useEffect, useEffectEvent } from "react";
import type { PreviewColorScheme, ThemeConfig } from "../model/theme-config";
import type { PageId } from "../stories/types";

interface PreviewState {
    pageId: PageId;
    storyId: string;
    colorScheme: PreviewColorScheme;
    config: ThemeConfig;
}

type PreviewMessage =
    | { type: "kc-preview:state"; payload: PreviewState }
    | { type: "kc-preview:ready" };
export function useReceivePreviewState(onState: (message: PreviewState) => void) {
    const handleState = useEffectEvent(onState);
    useEffect(() => {
        function handleMessage(event: MessageEvent<PreviewMessage>) {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data.type === "kc-preview:state") {
                handleState(event.data.payload);
            }
        }

        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "kc-preview:ready" }, window.location.origin);

        return () => window.removeEventListener("message", handleMessage);
    }, []);
}

export function usePushPreviewState(
    iframeRef: RefObject<HTMLIFrameElement | null>,
    pageId: PageId,
    storyId: string,
    colorScheme: PreviewColorScheme,
    config: ThemeConfig,
) {
    const postState = useEffectEvent(() => {
        const message: PreviewMessage = {
            type: "kc-preview:state",
            payload: { pageId, storyId, colorScheme, config },
        };
        iframeRef.current?.contentWindow?.postMessage(message, window.location.origin);
    });

    useEffect(() => {
        function handleMessage(event: MessageEvent<PreviewMessage>) {
            if (event.origin !== window.location.origin) {
                return;
            }
            if (event.data.type === "kc-preview:ready") {
                postState();
            }
        }

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        postState();
    }, [pageId, storyId, colorScheme, config]);
}
