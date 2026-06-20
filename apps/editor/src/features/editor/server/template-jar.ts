import { readFileSync } from "node:fs";

/**
 * Loads the bytes of the template Keycloak theme JAR.
 *
 * The JAR is copied into `./templates/base-theme.jar` by
 * `scripts/copy-template-jar.mjs` (run as `predev`/`prebuild`). We reference it
 * via `new URL(..., import.meta.url)` so Vite emits it as an asset of the server
 * bundle and resolves it to a real file path in both dev and production builds.
 *
 * Server-only: this reads from disk with `node:fs` and must never be imported
 * into client code (call it from the JAR-export server function).
 */
const TEMPLATE_JAR_URL = new URL("./templates/base-theme.jar", import.meta.url);

export function loadTemplateJar(): Uint8Array {
    try {
        return readFileSync(TEMPLATE_JAR_URL);
    } catch (cause) {
        throw new Error(
            "Template theme JAR not found. Run `pnpm theme:build-keycloak-theme` " +
                "(then `pnpm -F @kc-studio/editor dev`) to generate and copy it.",
            { cause },
        );
    }
}
