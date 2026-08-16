import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { oidcSpa } from "oidc-spa/vite-plugin";
import { defineConfig } from "vite";

const config = defineConfig({
    resolve: { tsconfigPaths: true },
    plugins: [
        devtools(),
        tailwindcss(),
        tanstackStart(),
        nitro({
            serverAssets: [{ baseName: "theme-template", dir: "./src/features/editor/server/templates" }],
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
