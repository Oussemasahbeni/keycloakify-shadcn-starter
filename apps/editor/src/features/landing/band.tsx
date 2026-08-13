import { cn } from "#/lib/utils";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * One ruled band of the landing page.
 *
 * The page reads as a single schematic document rather than a stack of cards: a
 * bounded column with 1px side rules, a top rule between consecutive bands, and
 * 5px triangles notching each band's top corners.
 *
 * Side rules only appear from `md` up (see the `wrapper` utility) — below that
 * the band runs edge to edge, so the notches are suppressed too since they'd
 * have no vertical rule to sit astride.
 */
export function Band({
    as: As = "section",
    className,
    children,
    ticks = true,
    topRule = true,
    ...rest
}: {
    as?: ElementType;
    /** Corner notches. Only render from `md` up, where the side rules exist. */
    ticks?: boolean;
    /** The rule separating this band from the one above. */
    topRule?: boolean;
} & ComponentPropsWithoutRef<"section">) {
    return (
        <As
            className={cn(
                "wrapper",
                topRule && "border-t",
                ticks && "md:tick-left md:tick-right",
                className,
            )}
            {...rest}
        >
            {children}
        </As>
    );
}

/**
 * The rhythm block repeated between content bands: a centred heading with an
 * optional lede. Reusing one component verbatim is what makes the page read as
 * one system rather than a series of one-off sections.
 */
export function SectionHeader({
    eyebrow,
    title,
    lede,
    className,
    ...rest
}: {
    eyebrow?: string;
    title: ReactNode;
    lede?: ReactNode;
} & ComponentPropsWithoutRef<"section">) {
    return (
        <Band
            className={cn("flex flex-col items-center gap-3 px-5 py-14 text-center sm:px-10 sm:py-24", className)}
            {...rest}
        >
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="max-w-2xl text-3xl font-medium tracking-tight text-balance sm:text-5xl">{title}</h2>
            {lede && <p className="text-muted-foreground max-w-md text-balance sm:text-pretty">{lede}</p>}
        </Band>
    );
}

/** Mono metadata label. The page's second typographic voice. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span className={cn("text-muted-foreground font-mono text-xs leading-none font-medium tracking-widest uppercase", className)}>{children}</span>
    );
}
