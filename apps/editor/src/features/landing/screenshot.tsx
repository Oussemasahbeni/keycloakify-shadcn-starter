import { cn } from "#/lib/utils";

/**
 * A screenshot served as AVIF → WebP → PNG.
 *
 * The PNGs in `public/` are 150–180 KB each; the same images are 13–30 KB as
 * AVIF. On the hero, where the screenshot is the LCP element, that is the
 * difference between a fast first paint and a slow one. `<picture>` lets the
 * browser take the best format it understands and fall back on its own, so the
 * PNG stays as a floor for anything old.
 *
 * Pass `src` as the `.png` path — the sibling `.webp` / `.avif` are derived.
 */
export function Screenshot({
    src,
    alt,
    width,
    height,
    className,
    priority = false,
    draggable,
}: {
    src: `${string}.png`;
    alt: string;
    width: number;
    height: number;
    className?: string;
    /** Set on the LCP image only — hints the browser to fetch it first. */
    priority?: boolean;
    draggable?: boolean;
}) {
    const base = src.replace(/\.png$/, "");

    return (
        <picture>
            <source srcSet={`${base}.avif`} type="image/avif" />
            <source srcSet={`${base}.webp`} type="image/webp" />
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : undefined}
                decoding={priority ? "sync" : "async"}
                draggable={draggable}
                className={cn(className)}
            />
        </picture>
    );
}
