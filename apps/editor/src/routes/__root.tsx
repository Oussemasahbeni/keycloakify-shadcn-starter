import { AutoLogoutWarningOverlay } from "#/components/AutoLogoutWarningOverlay";
import { DefaultCatchBoundary } from "#/components/DefaultCatchBoundary";
import { NotFound } from "#/components/not-found";
import { ThemeProvider } from "#/components/theme-provider";
import { Toaster } from "#/components/ui/sonner";
import { TooltipProvider } from "#/components/ui/tooltip";
import { seo } from "#/utils/seo";
import { HeadContent, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
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

function RootDocument({ children }: { children: React.ReactNode }) {
    // `/preview` is an isolated document: it themes itself through KcPage's own
    // ThemeProvider and drives its scheme from the editor (postMessage) or the
    // `?scheme` search param. The editor-chrome ThemeProvider below (storageKey
    // "theme") must NOT wrap it — being the outermost provider its blocking
    // ScriptOnce + mount effect stamp `.dark` from the editor's chrome scheme
    // and win, overriding the preview's requested scheme (the standalone tab
    // would otherwise ignore `?scheme`).
    const isPreview = useRouterState({
        select: state => state.location.pathname === "/preview",
    });

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                {isPreview ? (
                    children
                ) : (
                    <ThemeProvider defaultTheme="system" storageKey="theme">
                        <TooltipProvider>{children}</TooltipProvider>
                        <AutoLogoutWarningOverlay />
                        <Toaster />
                    </ThemeProvider>
                )}
                <Scripts />
            </body>
        </html>
    );
}
