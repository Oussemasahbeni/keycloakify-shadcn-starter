import { AutoLogoutWarningOverlay } from "#/components/AutoLogoutWarningOverlay";
import { LoadingScreen } from "#/components/loading-screen";
import { DefaultCatchBoundary } from "#/components/DefaultCatchBoundary";
import { NotFound } from "#/components/not-found";
import { ThemeProvider } from "#/components/theme-provider";
import { Toaster } from "#/components/ui/sonner";
import { TooltipProvider } from "#/components/ui/tooltip";
import { seo } from "#/utils/seo";
import { HeadContent, Scripts, createRootRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            ...seo({
                title: "Keycloak Theme Editor — Visually customize Keycloak login themes",
                description:
                    "An open-source visual editor for Keycloak login themes. Customize colors, fonts, radius, and layout with shadcn/ui, preview every login page live, and export a deploy-ready theme.",
                keywords:
                    "Keycloak, Keycloak theme, Keycloakify, login theme, theme editor, shadcn/ui, Tailwind CSS, OIDC, SSO",
                image: "/editor-preview-white.png",
            }),
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
            {
                rel: "apple-touch-icon",
                sizes: "180x180",
                href: "/apple-touch-icon.png",
            },
            {
                rel: "icon",
                type: "image/png",
                sizes: "32x32",
                href: "/favicon-32x32.png",
            },
            {
                rel: "icon",
                type: "image/png",
                sizes: "16x16",
                href: "/favicon-16x16.png",
            },
            { rel: "manifest", href: "/site.webmanifest" },
            { rel: "icon", href: "/favicon.ico" },
        ],
    }),
    errorComponent: DefaultCatchBoundary,
    notFoundComponent: () => <NotFound />,
    shellComponent: RootDocument,
});

function useHasSsrDisabledRoute() {
    const router = useRouter();
    return router.state.matches.some((m) => m.ssr === false);
}

function RootDocument({ children }: { children: React.ReactNode }) {
    const [hydrated, setHydrated] = useState(false);
    const hasSsrDisabledRoute = useHasSsrDisabledRoute();

    useEffect(() => {
        setHydrated(true);
    }, []);

    const showFallback = !hydrated && hasSsrDisabledRoute;

    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>
            <body>
                <ThemeProvider defaultTheme="system" storageKey="theme">
                    <TooltipProvider>
                        {showFallback ? <LoadingScreen /> : children}
                    </TooltipProvider>
                    <AutoLogoutWarningOverlay />
                    <Toaster />
                </ThemeProvider>
                <Scripts />
            </body>
        </html>
    );
}
