import { buttonVariants } from "#/components/ui/button";
import { DISCORD_INVITE_URL } from "#/config/constants.ts";
import { cn } from "#/lib/utils";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { Link } from "@tanstack/react-router";
import { Band, Eyebrow } from "./band";

export function CtaSection() {
    return (
        <>
            <Band className="px-5 py-16 sm:px-10 sm:py-24">
                <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
                    <Eyebrow>Start designing</Eyebrow>
                    <h2 className="text-3xl font-medium tracking-tight text-balance sm:text-5xl">
                        Your login page is the first thing users see.
                    </h2>
                    <p className="text-muted-foreground max-w-md text-balance">
                        Start from a theme that already handles every page, then make it yours in a few clicks.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
                        <Link to="/editor" className={cn(buttonVariants({ variant: "default", size: "hero" }))}>
                            Open the editor
                        </Link>
                        <a
                            href={DISCORD_INVITE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ variant: "outline", size: "hero" }))}
                        >
                            <SiDiscord />
                            Join the Discord
                        </a>
                    </div>
                </div>
            </Band>
        </>
    );
}
