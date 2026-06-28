import type { ThemeAssetKey } from "#/features/editor/model/assets";
import { useEffect, useEffectEvent, useRef } from "react";

/**
 * Cross-context transport for the editor's uploaded preview images.
 *
 * The live preview runs in two places — the inline <iframe> (PreviewPane) and the
 * standalone full-screen tab ("open in new tab"). Both need the user's uploaded
 * image assets, which can't travel by URL (they're binary) — so the editor
 * publishes them over a same-origin BroadcastChannel and each preview consumes them.
 *
 * BroadcastChannel messages aren't buffered, so a preview that opens *after* an
 * upload would miss the broadcast. Hence a tiny request/reply handshake: a consumer
 * asks for the current assets on mount, the editor replies — in addition to pushing
 * live updates whenever assets change.
 */

const CHANNEL_NAME = "kc-preview";

/** Uploaded image assets keyed by asset (favicon included but ignored by previews). */
export type PreviewAssets = Partial<Record<ThemeAssetKey, File | null>>;
/** Wire protocol. `request` = "consumer joined — send current assets"; `assets` = the payload. */
type ChannelMessage = { type: "request" } | { type: "assets"; assets: PreviewAssets };

/**
 * Preview side (iframe or standalone tab): subscribe to file pushes and request the
 * current assets once on mount. `onAssets` receives each update.
 */
export function useReceivePreviewAssets(onAssetsReception: (assets: PreviewAssets) => void) {
    const handleAssets = useEffectEvent(onAssetsReception);
    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (e: MessageEvent<ChannelMessage>) => {
            if (e.data.type === "assets") handleAssets(e.data.assets);
        };

        // Request the current assets once on mount. The editor will reply with a `assets` message.
        channel.postMessage({ type: "request" } satisfies ChannelMessage);
        return () => channel.close();
    }, []);
}

/**
 * Editor side: open the channel once, answer consumers' requests with the latest
 * assets, and push updates whenever `assets` changes. Call once, high in the editor.
 */
export function usePublishPreviewAssets(assets: PreviewAssets) {
    const channelRef = useRef<BroadcastChannel | null>(null);

    const publishAssets = useEffectEvent(() => {
        const message: ChannelMessage = { type: "assets", assets };
        channelRef.current?.postMessage(message);
    });

    //  Set up the channel once and listen for requests from other tabs. When a request is received, push the current assets to all open tabs.
    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current = channel;
        channel.onmessage = (e: MessageEvent<ChannelMessage>) => {
            if (e.data.type === "request") publishAssets();
        };
        return () => {
            channel.close();
            channelRef.current = null;
        };
    }, []);

    //  whenever assets change, push them to open tabs.
    useEffect(() => {
        publishAssets();
    }, [assets]);
}
