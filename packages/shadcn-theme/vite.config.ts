import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { buildEmailTheme } from "keycloakify-emails";
import { keycloakify } from "keycloakify/vite-plugin";
import { rm } from "node:fs/promises";
import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: { tsconfigPaths: true },
    plugins: [
        react(),
        tailwindcss(),
        keycloakify({
            accountThemeImplementation: "none",
            themeName: "shadcn-theme",
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": "shadcn-theme.jar",
            },
            environmentVariables: [
                {
                    name: "SHADCN_THEME_LOGO_WHITE_URL",
                    default: "",
                },
                {
                    name: "SHADCN_THEME_LOGO_DARK_URL",
                    default: "",
                },
                { name: "SHADCN_THEME_LAYOUT", default: "two-column" },
                {
                    name: "SHADCN_THEME_SIDE_IMAGE_URL",
                    default: "",
                },
                {
                    name: "SHADCN_THEME_CARD_BG_URL",
                    default: "",
                },
                { name: "SHADCN_THEME_PRESET", default: "neutral" },
                { name: "SHADCN_THEME_BASE", default: "neutral" },
                { name: "SHADCN_THEME_RADIUS", default: "default" },
                { name: "SHADCN_THEME_FONT", default: "geist" },
                { name: "SHADCN_THEME_PLACEHOLDER", default: "true" },
            ],
            postBuild: async buildContext => {
                await buildEmailTheme({
                    templatesSrcDirPath: path.join(
                        buildContext.themeSrcDirPath,
                        "email",
                        "templates",
                    ),
                    i18nSourceFile: path.join(buildContext.themeSrcDirPath, "email", "i18n.ts"),
                    themeNames: buildContext.themeNames,
                    keycloakifyBuildDirPath: buildContext.keycloakifyBuildDirPath,
                    locales: [
                        "ar",
                        "ca",
                        "cs",
                        "da",
                        "de",
                        "el",
                        "en",
                        "es",
                        "fa",
                        "fi",
                        "fr",
                        "hu",
                        "it",
                        "ja",
                        "ka",
                        "lt",
                        "lv",
                        "nl",
                        "no",
                        "pl",
                        "pt",
                        "pt-BR",
                        "ru",
                        "sk",
                        "sv",
                        "th",
                        "tr",
                        "uk",
                        "zh-CN",
                        "zh-TW",
                    ],
                    esbuild: {
                        jsx: "automatic",
                    },
                    cwd: import.meta.dirname,
                    environmentVariables: buildContext.environmentVariables,
                });

                // Slim the JAR: drop the PatternFly/jQuery base resources keycloakify
                // injects from its own package. This theme sets `doUseDefaultCss: false`
                // and wires every style manually, so none of it is loaded (the FTL only
                // declares `resourcesCommonPath` as a variable, never <link>s it). Deleting
                // here — after keycloakify staged the resources, before the JAR is packed —
                // is the only durable removal point; deleting the `public/` mirrors doesn't
                // work because the build re-copies them from node_modules every time.
                // Removes ~2.5 MB (compressed): 5.6 MB → ~3.1 MB.
                const resourcesDir = path.join(buildContext.keycloakifyBuildDirPath, "resources");
                for (const themeName of buildContext.themeNames) {
                    const loginResources = path.join(
                        resourcesDir,
                        "theme",
                        themeName,
                        "login",
                        "resources",
                    );
                    // `dist/keycloak-theme` = leaked dev-server mirror (sync-extensions);
                    // `resources-common` = the default PatternFly/jQuery base.
                    await rm(path.join(loginResources, "dist", "keycloak-theme"), {
                        recursive: true,
                        force: true,
                    });
                    await rm(path.join(loginResources, "resources-common"), {
                        recursive: true,
                        force: true,
                    });
                    await rm(path.join(loginResources, "js"), {
                        recursive: true,
                        force: true,
                    });
                    await rm(path.join(loginResources, "css"), {
                        recursive: true,
                        force: true,
                    });
                    await rm(path.join(loginResources, "img"), {
                        recursive: true,
                        force: true,
                    });
                }
            },
        }),
    ],
});
