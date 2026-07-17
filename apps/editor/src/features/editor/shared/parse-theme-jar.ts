import type { ThemeAssetKey } from "#/features/editor/shared/model/assets.ts";
import { assetDefinitions, emptyAssets } from "#/features/editor/shared/model/assets.ts";

import { strFromU8, unzipSync } from "fflate";
import { MANIFEST_PATH } from "./constants";
import { isValidJarSignature, mimeFromFilename } from "./files";
import type { EmailThemeConfig, LoginThemeConfig } from "./model/theme-config";
import { defaultLoginThemeConfig, themeConfigSchema } from "./model/theme-config";

/** The editor state reconstructed from an imported JAR, ready for hydration. */
export type ParsedTheme = {
    themeName: string;
    login: LoginThemeConfig;
    assets: Record<ThemeAssetKey, File | null>;
    email: EmailThemeConfig;
    emailLogoFile: File | null;
};

/** The marker the export bake uses to point a config URL at a JAR-bundled file. */
const BASE_URL_PREFIX = "%BASE_URL%/";

function toFile(bytes: Uint8Array, filename: string): File {
    return new File([new Uint8Array(bytes)], filename, { type: mimeFromFilename(filename) });
}

/**
 * Reconstructs full editor state from a JAR this editor produced.
 *
 * Reads the embedded manifest (rejecting any JAR without one), then walks the
 * bundled images back into editable `File`s: a login URL of the form
 * `%BASE_URL%/<file>` means the bytes live in `login/resources/dist/`, so we
 * rebuild the File and reset that URL to its default (the File is now the source
 * of truth, and it wins over the URL on re-export anyway). Plain http(s)/data
 * URLs are left untouched.
 */
export function parseThemeJar(bytes: Uint8Array): ParsedTheme {
    if (!isValidJarSignature(bytes)) {
        throw new Error("This file doesn't look like a valid .jar. Please select a different file.");
    }

    const MAX_JAR_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    if (bytes.length > MAX_JAR_SIZE_BYTES) {
        throw new Error("This jar file is too large. Please use a smaller file.");
    }

    let entries: Record<string, Uint8Array | undefined>;
    try {
        entries = unzipSync(bytes);
    } catch {
        throw new Error("Couldn't read the file — is it a valid theme .jar?");
    }

    const rawManifest = entries[MANIFEST_PATH];
    if (!rawManifest) {
        throw new Error("This .jar wasn't exported by the editor (no theme manifest found).");
    }
    const manifest = themeConfigSchema.parse(JSON.parse(strFromU8(rawManifest)));

    const themeName = manifest.themeName.trim();
    const loginDist = `theme/${themeName}/login/resources/dist/`;
    const emailResources = `theme/${themeName}/email/resources/`;

    const login = { ...manifest.login };
    const email = { ...manifest.email };
    const assets: Record<ThemeAssetKey, File | null> = { ...emptyAssets };

    // Bundled login images → editable Files; external URLs stay as URLs.
    for (const { key } of assetDefinitions) {
        const url = login[key];
        if (!url.startsWith(BASE_URL_PREFIX)) continue;
        const filename = url.slice(BASE_URL_PREFIX.length);
        const fileBytes = entries[loginDist + filename];
        if (!fileBytes) continue; // referenced but missing — leave the URL, no File
        assets[key] = toFile(fileBytes, filename);
        login[key] = defaultLoginThemeConfig[key];
    }

    // Favicon is upload-only; recover the baked favicon.ico if present.
    const faviconBytes = entries[`${loginDist}favicon.ico`];
    if (faviconBytes) assets.favicon = toFile(faviconBytes, "favicon.ico");

    // Email logo: a bare bundled filename → File; an external URL stays a URL.
    let emailLogoFile: File | null = null;
    const emailLogo = email.logoUrl;
    if (emailLogo && !/^(https?:|data:|%BASE_URL%)/.test(emailLogo)) {
        const fileBytes = entries[emailResources + emailLogo];
        if (fileBytes) {
            emailLogoFile = toFile(fileBytes, emailLogo);
            email.logoUrl = undefined;
        }
    }

    return { themeName, login, assets, email, emailLogoFile };
}
