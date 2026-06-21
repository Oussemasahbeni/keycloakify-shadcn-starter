import { Logo } from "#/components/logo";
import { buttonVariants } from "#/components/ui/button";
import { Separator } from "#/components/ui/separator";
import {
    DISCORD_INVITE_URL,
    GITHUB_URL,
    KEYCLOAKIFY_URL,
    SHADCN_URL,
    TAILWIND_URL,
} from "#/config/constants.ts";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { Link } from "@tanstack/react-router";

const CURRENT_YEAR = new Date().getFullYear();

const productLinks = [
    { name: "Features", href: "#features", external: false },
    { name: "FAQ", href: "#faq", external: false },
    { name: "Open the Editor", href: "/editor", external: false },
];

const resourceLinks = [
    { name: "GitHub", href: GITHUB_URL, external: true },
    { name: "Discord", href: DISCORD_INVITE_URL, external: true },
    { name: "Keycloakify", href: KEYCLOAKIFY_URL, external: true },
    { name: "Tailwind CSS", href: TAILWIND_URL, external: true },
    { name: "shadcn/ui", href: SHADCN_URL, external: true },
];

const socialLinks = [
    { name: "GitHub", href: GITHUB_URL, icon: SiGithub },
    { name: "Discord", href: DISCORD_INVITE_URL, icon: SiDiscord },
];

function FooterLink({ name, href, external }: { name: string; href: string; external: boolean }) {
    const className = "text-muted-foreground hover:text-foreground transition-colors";

    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                {name}
            </a>
        );
    }

    if (href.startsWith("#")) {
        return (
            <a href={href} className={className}>
                {name}
            </a>
        );
    }

    return (
        <Link to={href} className={className}>
            {name}
        </Link>
    );
}

export function LandingFooter() {
    return (
        <footer id="contact" className="bg-background border-t">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="col-span-2 max-w-md">
                        <Link
                            to="/"
                            className="mb-4 flex w-fit items-center gap-2 max-lg:mx-auto max-lg:justify-center"
                        >
                            <Logo size={32} />
                            <span className="text-xl font-bold">Keycloak Theme Editor</span>
                        </Link>
                        <p className="text-muted-foreground mb-6 max-lg:text-center">
                            An open-source visual editor for Keycloak login themes. Customize
                            colors, fonts, and layout, preview every page live, and export a
                            deploy-ready theme.
                        </p>
                        <div className="flex gap-2 max-lg:justify-center">
                            {socialLinks.map(social => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    aria-label={social.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                                >
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold">Product</h4>
                        <ul className="space-y-3">
                            {productLinks.map(link => (
                                <li key={link.name}>
                                    <FooterLink {...link} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="mb-4 font-semibold">Resources</h4>
                        <ul className="grid gap-y-3 lg:grid-flow-col lg:grid-rows-3 lg:gap-x-12">
                            {resourceLinks.map(link => (
                                <li key={link.name}>
                                    <FooterLink {...link} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="text-muted-foreground flex items-center justify-center text-sm">
                    <span>© {CURRENT_YEAR} Keycloak Theme Editor · MIT License</span>
                </div>
            </div>
        </footer>
    );
}
