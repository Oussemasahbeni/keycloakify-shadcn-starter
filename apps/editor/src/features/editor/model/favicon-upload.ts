import { z } from "zod";

/** Largest favicon upload we accept (a real icon is a few KB). */
export const MAX_FAVICON_BYTES = 1024 * 1024; // 1 MB

const EXTENSIONS = [".png", ".svg", ".ico"];
const MIME_TYPES = ["image/png", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon"];

export const faviconFileSchema = z
    .instanceof(File, { error: "Favicon must be a file." })
    .refine(
        file =>
            EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext)) ||
            MIME_TYPES.includes(file.type),
        "Use a PNG, SVG, or ICO file.",
    )
    .refine(file => file.size <= MAX_FAVICON_BYTES, "File is too large (max 1 MB).");

export function getFaviconError(file: File): string | null {
    const result = faviconFileSchema.safeParse(file);
    return result.success ? null : (result.error.issues[0]?.message ?? "Invalid file.");
}
