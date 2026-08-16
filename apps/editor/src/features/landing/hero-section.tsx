import { Link } from "@tanstack/react-router";

import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";

import { Band, Eyebrow } from "./band";
import { Screenshot } from "./screenshot";

export function HeroSection() {
    return (
        <Band id="hero" topRule={false} ticks={false}>
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 pt-16 pb-10 text-center sm:px-10 sm:pt-24 sm:pb-14">
                <Eyebrow>Visual theming for Keycloak</Eyebrow>

                <h1 className="text-4xl font-medium tracking-tighter text-balance sm:text-6xl">
                    Design Keycloak login pages like they belong to your app.
                </h1>

                <p className="max-w-136 text-pretty text-muted-foreground sm:text-lg">
                    Turn Keycloak&apos;s dated default screens into a modern sign-in experience — every login page and
                    every email — without writing a single line of code. Export a deploy-ready{" "}
                    <code className="font-mono">.jar</code> when you&apos;re done.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                    <Link to="/editor" className={cn(buttonVariants({ variant: "default", size: "hero" }))}>
                        Start designing free
                    </Link>
                    <a href="#gallery" className={cn(buttonVariants({ variant: "outline", size: "hero" }))}>
                        See what you can build
                    </a>
                </div>

                <p className="text-xs text-muted-foreground">
                    Free to design — every page, every control. Pay only when you export.
                </p>
            </div>

            <div className="relative mx-auto max-w-6xl px-5 pb-14 sm:px-10 sm:pb-20">
                <div
                    aria-hidden
                    className="absolute inset-x-8 top-2 bottom-8 -z-10 rounded-full bg-[linear-gradient(100deg,oklch(0.488_0.243_264.376),oklch(0.518_0.253_323.949),oklch(0.553_0.195_38.402),oklch(0.508_0.118_165.612))] opacity-15 blur-3xl dark:opacity-20"
                />
                <Screenshot
                    src="/images/editor-preview-white.png"
                    alt="The editor: a configuration sidebar beside a live preview of a themed Keycloak login page"
                    width={2560}
                    height={1271}
                    priority
                    className="w-full rounded-xl border bg-background shadow-lg dark:hidden"
                />
                <Screenshot
                    src="/images/editor-preview-dark.png"
                    alt="The editor: a configuration sidebar beside a live preview of a themed Keycloak login page"
                    width={2560}
                    height={1271}
                    className="hidden w-full rounded-xl border bg-background shadow-lg dark:block"
                />
            </div>
        </Band>
    );
}
