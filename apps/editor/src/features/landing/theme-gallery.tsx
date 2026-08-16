import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import type { CarouselApi } from "#/components/ui/carousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "#/components/ui/carousel";

import { Band } from "./band";
import { Screenshot } from "./screenshot";

/** Every capture shares this frame — `scripts/encode-gallery.mjs` enforces it. */
const FRAME = { width: 1991, height: 1271 } as const;

/**
 * One capture per entry. `label` is the button, `caption` is the alt text, and
 * the `.png` is `id` — see `public/images/gallery/`.
 */
const GALLERY = [
    { id: "sign-in", label: "Sign in", caption: "A sign-in page with social providers" },
    { id: "light-mode", label: "Light mode", caption: "The same sign-in page in light mode" },
    { id: "side-panel-image", label: "Side panel", caption: "Recovery codes beside a photographic side panel" },
    { id: "monospace", label: "Monospace", caption: "A sign-in page set entirely in a monospace face" },
    {
        id: "select-authenticator",
        label: "Authenticator",
        caption: "Choosing between an authenticator app and a passkey",
    },
    { id: "centered-card", label: "Centered card", caption: "A sign-in page on a single centred card" },
    { id: "side-image", label: "Side image", caption: "A one-time code prompt with the image inside the card" },
    { id: "delete-account", label: "Delete account", caption: "A destructive confirmation, styled with the rest" },
] as const;

export function ThemeGallery() {
    const [api, setApi] = useState<CarouselApi>();
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!api) return;

        const sync = () => setActive(api.selectedScrollSnap());
        sync();
        api.on("select", sync);
        api.on("reInit", sync);

        return () => {
            api.off("select", sync);
            api.off("reInit", sync);
        };
    }, [api]);

    return (
        <Band>
            <Carousel
                setApi={setApi}
                aria-label="Screens built with the editor"
                className="mx-auto w-full max-w-6xl p-5 sm:p-10"
            >
                <CarouselContent>
                    {GALLERY.map((entry, index) => (
                        <CarouselItem key={entry.id}>
                            <Screenshot
                                src={`/images/gallery/${entry.id}.png`}
                                alt={entry.caption}
                                width={FRAME.width}
                                height={FRAME.height}
                                priority={index === 0}
                                className="size-full rounded-lg border object-cover"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <div className="flex flex-wrap items-center gap-2 border-t px-4 py-2">
                {GALLERY.map((entry, index) => (
                    <Button
                        onClick={() => api?.scrollTo(index)}
                        aria-current={index === active ? "true" : undefined}
                        key={entry.id}
                        variant={index === active ? "default" : "ghost"}
                    >
                        {entry.label}
                    </Button>
                ))}
            </div>
        </Band>
    );
}
