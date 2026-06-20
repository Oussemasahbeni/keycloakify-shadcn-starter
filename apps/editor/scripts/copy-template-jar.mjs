// Copies the built Keycloak theme JAR from the theme package into the editor's
// source tree so the JAR-export server function can read it at runtime.
//
// The JAR is a *build artifact* (git-ignored) produced by
// `pnpm theme:build-keycloak-theme`. This script only copies it — it never
// builds it (the keycloakify build is slow; we don't want it on every dev start).
// Wired as `predev` / `prebuild` in package.json.
//
// If the source JAR is missing we warn and exit 0 rather than blocking the dev
// server; the export feature simply won't work until the theme is built. The
// loader (`template-jar.ts`) throws a clear error at call time in that case.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const editorRoot = join(here, "..");
const themeRoot = join(editorRoot, "..", "..");

const source = join(themeRoot, "packages", "shadcn-theme", "dist_keycloak", "shadcn-theme.jar");
const destDir = join(editorRoot, "src", "features", "editor", "server", "templates");
const dest = join(destDir, "base-theme.jar");

if (!existsSync(source)) {
    const message = existsSync(dest)
        ? `[copy-template-jar] Source JAR not found at ${source}; keeping existing copy at ${dest}.`
        : `[copy-template-jar] Source JAR not found at ${source}. ` +
          `Run \`pnpm theme:build-keycloak-theme\` to generate it; JAR export will not work until then.`;
    console.warn(message);
    process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(source, dest);
console.log(`[copy-template-jar] Copied template JAR → ${dest}`);
