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
        tanstackStart(),
        // {
        //     prerender: {
        //         enabled: true,
        //         // The landing page links to /editor (client-only, ssr:false), so don't
        //         // crawl links — only prerender the explicitly listed pages below.
        //         crawlLinks: false,
        //         // only the root path or the paths defined in the pages config will be prerendered
        //         autoStaticPathsDiscovery: false,
        //     },

        //     spa: { enabled: true, maskPath: "/editor" },
        //     pages: [{ path: "/", prerender: { enabled: true } }],
        // }
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
