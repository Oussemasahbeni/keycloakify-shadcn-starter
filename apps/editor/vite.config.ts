import { devtools } from "@tanstack/devtools-vite";
import { defineConfig } from "vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { oidcSpa } from "oidc-spa/vite-plugin";

const config = defineConfig({
    resolve: { tsconfigPaths: true },
    plugins: [
        devtools(),
        tailwindcss(),
        tanstackStart(),
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
