import type { ThemeAssetKey } from "#/features/editor/model/assets";
import { useEffect, useEffectEvent, useRef } from "react";

/**
 * Cross-context transport for the editor's uploaded preview images.
 *
 * The live preview runs in two places — the inline <iframe> (PreviewPane) and the
 * standalone full-screen tab ("open in new tab"). Both need the user's uploaded
 * image Files, which can't travel by URL (they're binary) — so the editor
 * publishes them over a same-origin BroadcastChannel and each preview consumes them.
 *
 * BroadcastChannel messages aren't buffered, so a preview that opens *after* an
 * upload would miss the broadcast. Hence a tiny request/reply handshake: a consumer
 * asks for the current files on mount, the editor replies — in addition to pushing
 * live updates whenever files change.
 */

const CHANNEL_NAME = "kc-preview";

/** Uploaded image files keyed by asset (favicon included but ignored by previews). */
export type PreviewFiles = Partial<Record<ThemeAssetKey, File | null>>;
/** Wire protocol. `request` = "consumer joined — send current files"; `files` = the payload. */
type ChannelMessage = { type: "request" } | { type: "files"; files: PreviewFiles };

/**
 * Preview side (iframe or standalone tab): subscribe to file pushes and request the
 * current files once on mount. `onFiles` receives each update.
 */
export function useReceivePreviewFiles(onFilesReception: (files: PreviewFiles) => void) {
    const handleFiles = useEffectEvent(onFilesReception);
    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (e: MessageEvent<ChannelMessage>) => {
            if (e.data.type === "files") handleFiles(e.data.files);
        };

        // Request the current files once on mount. The editor will reply with a `files` message.
        channel.postMessage({ type: "request" } satisfies ChannelMessage);
        return () => channel.close();
    }, []);
}

/**
 * Editor side: open the channel once, answer consumers' requests with the latest
 * files, and push updates whenever `files` changes. Call once, high in the editor.
 */
export function usePublishPreviewFiles(files: PreviewFiles) {
    const channelRef = useRef<BroadcastChannel | null>(null);

    const publishFiles = useEffectEvent(() => {
        const message: ChannelMessage = { type: "files", files };
        channelRef.current?.postMessage(message);
    });

    //  Set up the channel once and listen for requests from other tabs. When a request is received, push the current files to all open tabs.
    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current = channel;
        channel.onmessage = (e: MessageEvent<ChannelMessage>) => {
            if (e.data.type === "request") publishFiles();
        };
        return () => {
            channel.close();
            channelRef.current = null;
        };
    }, []);

    //  whenever files change, push them to open tabs.
    useEffect(() => {
        publishFiles();
    }, [files]);
}
