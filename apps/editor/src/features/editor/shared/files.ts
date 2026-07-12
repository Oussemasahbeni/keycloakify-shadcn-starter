export const MAX_IMAGE_SIZE_BYTES = 1024 * 1024; // 1 MB


export const EMAIL_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"];
export const EMAIL_IMAGE_MIME_TYPES = ["image/png", "image/jpeg"];



export const LOGIN_IMAGE_EXTENSIONS = [".png", ".svg", ".jpg", ".jpeg"];
export const LOGIN_IMAGE_MIME_TYPES = ["image/png", "image/svg+xml", "image/jpeg"];


const EXTENSION_BY_MIME: Record<string, string> = {
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/jpeg": "jpg",
};

/**
 * Safe lowercase extension for the baked asset filename, from the upload's name
 * (preferred) or MIME type. Defaults to `png`. The result feeds a `<baseName>.<ext>`
 * filename that must satisfy the JAR's `ASSET_NAME_PATTERN`.
 */
export function getImageExtension(file: File): string {
    const fromName = /\.([a-z0-9]+)$/.exec(file.name.toLowerCase())?.[1];
    if (fromName === "jpeg") return "jpg";
    if (fromName && ["png", "svg", "jpg"].includes(fromName)) return fromName;
    return EXTENSION_BY_MIME[file.type] ?? "png";
}