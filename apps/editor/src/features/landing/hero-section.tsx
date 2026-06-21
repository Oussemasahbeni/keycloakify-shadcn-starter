import { DotPattern } from "#/components/dot-pattern";
import { buttonVariants } from "#/components/ui/button";
import { GITHUB_URL } from "#/config/constants.ts";
import { cn } from "#/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Link } from "@tanstack/react-router";

export function HeroSection() {
    return (
        <section
            id="hero"
            className="from-background to-background/80 relative overflow-hidden bg-linear-to-b pt-16 pb-16 sm:pt-20"
        >
            <div className="absolute inset-0">
                <DotPattern className="opacity-100" size="md" fadeStyle="ellipse" />
            </div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Build Better
                        <span className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent">
                            {" "}
                            Keycloak Themes{" "}
                        </span>
                        with a Visual Editor
                    </h1>

                    <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
                        Customize your Keycloak login pages visually using shadcn/ui components.
                        Built for developers who value both design and developer experience.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link to="/editor" className={buttonVariants({ variant: "default" })}>
                            Get Started
                        </Link>
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(buttonVariants({ variant: "secondary" }), "cursor-pointer")}
                        >
                            <SiGithub data-icon="inline-start" />
                            View on GitHub
                        </a>
                    </div>
                </div>

                <div className="mx-auto mt-20 max-w-6xl">
                    <div className="group relative">
                        <div className="bg-primary/50 absolute top-2 left-1/2 mx-auto h-24 w-[90%] -translate-x-1/2 transform rounded-full blur-3xl lg:-top-8 lg:h-80" />

                        <div className="bg-card relative rounded-xl border shadow-2xl">
                            <img
                                src="/editor-preview-white.png"
                                alt="Keycloak Theme Editor visually customizing a login page in light mode"
                                className="block w-full rounded-xl object-cover dark:hidden"
                                width={2559}
                                height={1273}
                            />

                            <img
                                src="/editor-preview-dark.png"
                                alt="Keycloak Theme Editor visually customizing a login page in dark mode"
                                className="hidden w-full rounded-xl object-cover dark:block"
                                width={2559}
                                height={1268}
                            />

                            <div className="from-background/0 via-background/70 to-background absolute bottom-0 left-0 h-32 w-full rounded-b-xl bg-linear-to-b md:h-40 lg:h-48" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
