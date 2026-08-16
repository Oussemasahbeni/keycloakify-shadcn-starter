import { ChevronsLeftRight } from "lucide-react";
import { animate, m, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

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
 *
 * On first view the divider demonstrates itself: one slow sweep left, right and
 * back to centre. The demo runs once, skips for reduced motion, and dies the
 * instant the user touches the slider. Everything is driven through motion
 * values, so neither the demo nor dragging ever re-renders the component.
 */
export function CompareSection() {
    const frameRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasInteracted = useRef(false);

    const position = useMotionValue(50);
    const clipPath = useTransform(position, p => `inset(0 ${100 - p}% 0 0)`);
    const left = useTransform(position, p => `${p}%`);

    const isInView = useInView(frameRef, { once: true, amount: 0.35 });
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (!isInView || hasInteracted.current || prefersReducedMotion) return;
        const demo = animate(position, [50, 30, 70, 50], {
            delay: 0.35,
            duration: 3,
            ease: "easeInOut",
            // Keep the (uncontrolled) input in step so grabbing it mid-demo
            // continues from where the divider is, not from where it started.
            onUpdate: value => {
                if (inputRef.current) inputRef.current.value = String(value);
            },
        });
        return () => demo.stop();
    }, [isInView, prefersReducedMotion, position]);

    /** Any interaction ends the demo for good; the input takes over from here. */
    const stopDemo = () => {
        hasInteracted.current = true;
        position.stop();
    };

    return (
        <Band className="p-5 sm:p-10">
            <div
                ref={frameRef}
                className="group relative mx-auto max-w-6xl overflow-hidden rounded-lg border select-none"
            >
                <Screenshot
                    src="/images/gallery/sign-in.png"
                    alt="The same login page themed with the editor"
                    width={FRAME.width}
                    height={FRAME.height}
                    draggable={false}
                    className="w-full"
                />

                {/* The stock capture sits on top, clipped to the left of the divider. */}
                <m.div aria-hidden className="absolute inset-0" style={{ clipPath }}>
                    <Screenshot
                        src="/images/gallery/old-keycloak.png"
                        alt=""
                        width={FRAME.width}
                        height={FRAME.height}
                        draggable={false}
                        className="w-full"
                    />
                </m.div>

                {/* Divider + grip, driven by the slider value. */}
                <m.div
                    aria-hidden
                    className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-foreground/60"
                    style={{ left }}
                >
                    <div className="absolute top-1/2 left-1/2 flex size-9 -translate-1/2 items-center justify-center rounded-full border bg-background shadow-md transition-transform duration-200 ease-out group-active:scale-110">
                        <ChevronsLeftRight className="size-4 text-muted-foreground" />
                    </div>
                </m.div>

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
                    ref={inputRef}
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    defaultValue={50}
                    onPointerDown={stopDemo}
                    onKeyDown={stopDemo}
                    onChange={event => {
                        stopDemo();
                        position.set(Number(event.target.value));
                    }}
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
