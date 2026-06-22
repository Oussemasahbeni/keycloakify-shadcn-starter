import { Logo } from "#/components/logo";
import { ModeToggle } from "#/components/mode-toggle";
import { Button, buttonVariants } from "#/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "#/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "#/components/ui/sheet";
import { DISCORD_INVITE_URL, GITHUB_URL } from "#/config/constants.ts";
import { cn } from "#/lib/utils";
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
];

function smoothScrollTo(targetId: string) {
    if (targetId.startsWith("#")) {
        const element = document.querySelector(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
}

function Brand() {
    return (
        <div className="flex cursor-pointer items-center gap-2">
            <Logo size={32} />
            <span className="font-bold">Keycloak Theme Editor</span>
        </div>
    );
}

function GithubLink() {
    return (
        <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "cursor-pointer")}
        >
            <SiGithub />
        </a>
    );
}

function DiscordLink() {
    return (
        <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord Server"
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "cursor-pointer")}
        >
            <SiDiscord />
        </a>
    );
}

function GetStartedButton({ className }: { className?: string }) {
    return (
        <Link className={cn(buttonVariants({ variant: "default" }), className)} to="/editor">
            Get Started
        </Link>
    );
}

function DesktopNav() {
    return (
        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                {NAV_ITEMS.map(item => (
                    <NavigationMenuItem key={item.name}>
                        <NavigationMenuLink
                            onClick={e => {
                                e.preventDefault();
                                if (item.href.startsWith("#")) {
                                    smoothScrollTo(item.href);
                                } else {
                                    window.location.href = item.href;
                                }
                            }}
                        >
                            {item.name}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function DesktopActions() {
    return (
        <div className="hidden items-center gap-2 md:flex">
            <ModeToggle />
            <DiscordLink />
            <GithubLink />
            <GetStartedButton />
        </div>
    );
}

function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
                render={
                    <Button variant="ghost" size="icon" className="cursor-pointer">
                        <Menu />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                }
                className="md:hidden"
            />
            <SheetContent className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:w-100 [&>button]:hidden">
                <div className="flex h-full flex-col">
                    <SheetHeader className="space-y-0 border-b p-4 pb-2">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <div className="flex items-center gap-2">
                            <Logo size={32} />
                            <div className="ml-auto flex items-center gap-2">
                                <ModeToggle />
                                <GithubLink />
                                <DiscordLink />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="size-8 cursor-pointer"
                                >
                                    <X />
                                </Button>
                            </div>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto">
                        <nav className="space-y-1 p-6">
                            {NAV_ITEMS.map(item => (
                                <div key={item.name}>
                                    <button
                                        type="button"
                                        className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center rounded-lg px-4 py-3 text-left text-base font-medium transition-colors"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setTimeout(() => smoothScrollTo(item.href), 100);
                                        }}
                                    >
                                        {item.name}
                                    </button>
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="border-t p-6">
                        <GetStartedButton className="w-full" />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export function Header() {
    return (
        <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Brand />
                <DesktopNav />
                <DesktopActions />
                <MobileMenu />
            </div>
        </header>
    );
}
