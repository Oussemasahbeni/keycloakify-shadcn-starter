import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { DISCORD_INVITE_URL, GITHUB_URL } from "#/config/constants.ts";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { Eye, Package, Palette } from "lucide-react";
import { CardDecorator } from "./card-decorator";

const values = [
    {
        icon: Eye,
        title: "Live Preview",
        description:
            "Tweak colors, fonts, radius, and layout and watch every Keycloak login page update in real time, in light and dark mode.",
    },
    {
        icon: Palette,
        title: "shadcn/ui + Tailwind v4",
        description:
            "Built on shadcn/ui with OKLCH color theming, base palettes, font and radius presets, so your login pages match your product.",
    },
    {
        icon: Package,
        title: "Export to Keycloak",
        description:
            "Generate a deploy-ready Keycloakify theme JAR you drop into Keycloak's providers/ directory and select in your realm.",
    },
    {
        icon: SiGithub,
        title: "Open Source",
        description:
            "MIT-licensed and built on Keycloakify, React, Tailwind and TypeScript. Use it freely and contribute on GitHub.",
    },
];

export function AboutSection() {
    return (
        <section id="features" className="py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-4xl text-center">
                    <Badge variant="outline" className="mb-4">
                        Features
                    </Badge>
                    <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to theme Keycloak
                    </h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Style every login and registration page from one visual editor, then export
                        a production-ready theme. No FreeMarker, no guesswork.
                    </p>
                </div>

                <div className="mb-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
                    {values.map(value => (
                        <Card key={value.title} className="group py-2 shadow-xs">
                            <CardContent className="p-8">
                                <div className="flex flex-col items-center text-center">
                                    <CardDecorator>
                                        <value.icon className="size-6" aria-hidden />
                                    </CardDecorator>
                                    <h3 className="mt-6 font-medium text-balance">{value.title}</h3>
                                    <p className="text-muted-foreground mt-3 text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({
                                size: "lg",
                                className: "cursor-pointer",
                            })}
                        >
                            <SiGithub data-icon="inline-start" />
                            Star on GitHub
                        </a>
                        <a
                            href={DISCORD_INVITE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({
                                size: "lg",
                                variant: "outline",
                                className: "cursor-pointer",
                            })}
                        >
                            <SiDiscord data-icon="inline-start" />
                            Join Discord Community
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
