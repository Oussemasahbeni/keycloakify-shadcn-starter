import { Link } from "@tanstack/react-router";

import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";

import { Band, Eyebrow } from "./band";

export function HeroSection() {
    return (
        <Band id="hero" topRule={false} ticks={false}>
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 py-16 text-center sm:px-10 sm:py-24">
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
                        Open the editor
                    </Link>
                    <a href="#gallery" className={cn(buttonVariants({ variant: "outline", size: "hero" }))}>
                        See what you can build
                    </a>
                </div>
            </div>
        </Band>
    );
}
