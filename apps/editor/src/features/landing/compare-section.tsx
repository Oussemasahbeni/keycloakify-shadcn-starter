import { Band, Eyebrow } from "./band";
import { Screenshot } from "./screenshot";

/** Same frame as the gallery captures — `scripts/encode-gallery.mjs` enforces it. */
const FRAME = { width: 1991, height: 1271 } as const;

/**
 * Stock Keycloak next to the same page out of the editor. The gallery shows
 * variety; this band shows the delta — the strongest single argument the page
 * can make, so both captures share one frame and sit on the same rule.
 */
export function CompareSection() {
    return (
        <Band className="divide-border grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
            <figure className="flex flex-col gap-4 p-5 sm:p-8">
                <figcaption>
                    <Eyebrow>Before — stock Keycloak</Eyebrow>
                </figcaption>
                <Screenshot
                    src="/images/gallery/old-keycloak.png"
                    alt="Keycloak's default login page with the stock PatternFly theme"
                    width={FRAME.width}
                    height={FRAME.height}
                    className="w-full rounded-lg border"
                />
            </figure>

            <figure className="flex flex-col gap-4 p-5 sm:p-8">
                <figcaption>
                    <Eyebrow>After — a few minutes in the editor</Eyebrow>
                </figcaption>
                <Screenshot
                    src="/images/gallery/sign-in.png"
                    alt="The same login page themed with the editor"
                    width={FRAME.width}
                    height={FRAME.height}
                    className="w-full rounded-lg border"
                />
            </figure>
        </Band>
    );
}
