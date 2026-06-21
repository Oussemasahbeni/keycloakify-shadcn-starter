import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { oidcSpa } from "oidc-spa/vite-plugin";

const config = defineConfig({
    resolve: { tsconfigPaths: true },
    plugins: [
        devtools(),
        tailwindcss(),
        tanstackStart({
            prerender: {
                enabled: true,
                // The landing page links to /editor (client-only, ssr:false), so don't
                // crawl links — only prerender the explicitly listed pages below.
                crawlLinks: false,
                // only the root path or the paths defined in the pages config will be prerendered
                autoStaticPathsDiscovery: false,
            },
            // Emit a client-only shell (`_shell.html`) that Nitro serves as the
            // fallback for non-prerendered routes (`/editor`, `/preview`, both
            // ssr:false). Without it, those routes fall back to the prerendered
            // landing `index.html`, causing a home-page flash + hydration mismatch
            // (React #418) before the client router swaps in the real route.
            //
            // `maskPath` must differ from "/" (the default): the prerenderer dedups
            // pages by render path, so a "/" mask collides with the landing page
            // above and the shell is silently dropped. In shell mode only the root
            // route is SSR'd (children are ssr:false), so `enforceLogin` never runs
            // here and the chosen route's content is irrelevant — only root chrome
            // is emitted. Output still goes to `_shell.html`.
            spa: { enabled: true, maskPath: "/editor" },
            pages: [{ path: "/", prerender: { enabled: true } }],
        }),
        nitro({
            serverAssets: [
                { baseName: "theme-template", dir: "./src/features/editor/server/templates" },
            ],
        }),
        oidcSpa({
            browserRuntimeFreeze: {
                enabled: true,
            },
            DPoP: {
                enabled: true,
                mode: "auto",
            },
        }),
        viteReact(),
    ],
    ssr: {
        noExternal: ["@kc-studio/shadcn-theme"],
    },
});

export default config;
