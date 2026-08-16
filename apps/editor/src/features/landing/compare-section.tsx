import { ChevronsLeftRight } from "lucide-react";
import { useState } from "react";

import { Band, Eyebrow } from "./band";
import { Screenshot } from "./screenshot";

/** Same frame as the gallery captures — `scripts/encode-gallery.mjs` enforces it. */
const FRAME = { width: 1991, height: 1271 } as const;

/**
 * Stock Keycloak and the same page out of the editor, stacked in one frame with
 * a draggable divider. The gallery shows variety; this band shows the delta —
 * the strongest single argument the page can make, so the reader gets to wipe
 * one away with the other instead of comparing two images at a distance.
 *
 * The whole surface is a native `<input type="range">` laid invisibly over the
 * images: dragging, clicking and arrow keys all come for free, and the divider
 * just follows its value.
 */
export function CompareSection() {
    const [position, setPosition] = useState(50);

    return (
        <Band className="p-5 sm:p-10">
            <div className="group relative mx-auto max-w-6xl overflow-hidden rounded-lg border select-none">
                <Screenshot
                    src="/images/gallery/sign-in.png"
                    alt="The same login page themed with the editor"
                    width={FRAME.width}
                    height={FRAME.height}
                    draggable={false}
                    className="w-full"
                />

                {/* The stock capture sits on top, clipped to the left of the divider. */}
                <div aria-hidden className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
                    <Screenshot
                        src="/images/gallery/old-keycloak.png"
                        alt=""
                        width={FRAME.width}
                        height={FRAME.height}
                        draggable={false}
                        className="w-full"
                    />
                </div>

                {/* Divider + grip, driven by the slider value. */}
                <div
                    aria-hidden
                    className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-foreground/60"
                    style={{ left: `${position}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 flex size-9 -translate-1/2 items-center justify-center rounded-full border bg-background shadow-md transition-transform duration-200 ease-out group-active:scale-110">
                        <ChevronsLeftRight className="size-4 text-muted-foreground" />
                    </div>
                </div>

                <div className="pointer-events-none absolute top-3 left-3">
                    <Eyebrow className="rounded-md border bg-background/85 px-2 py-1.5 backdrop-blur">
                        Stock Keycloak
                    </Eyebrow>
                </div>
                <div className="pointer-events-none absolute top-3 right-3">
                    <Eyebrow className="rounded-md border bg-background/85 px-2 py-1.5 backdrop-blur">
                        Themed in the editor
                    </Eyebrow>
                </div>

                <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={position}
                    onChange={event => setPosition(Number(event.target.value))}
                    aria-label="Reveal more of the stock page or the themed page"
                    className="absolute inset-0 size-full cursor-ew-resize touch-pan-y appearance-none bg-transparent opacity-0"
                />
            </div>

            <p className="pt-4 text-center font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Drag to compare
            </p>
        </Band>
    );
}
