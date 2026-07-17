import { z } from "zod";
import { LOGIN_IMAGE_EXTENSIONS, LOGIN_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "../files";

/**
 * Validates an uploaded image (client form + server `generateJar` validator both
 * use this — keep it pure, no React). Mirrors `favicon-upload.ts`'s schema.
 */
export const assetSchema = z
    .instanceof(File, { error: "Image must be a file." })
    .refine(
        file =>
            LOGIN_IMAGE_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext)) ||
            LOGIN_IMAGE_MIME_TYPES.includes(file.type),
        "Use a PNG, SVG, or JPEG file.",
    )
    .refine(file => file.size <= MAX_IMAGE_SIZE_BYTES, "File is too large (max 1 MB).");

export function getImageError(file: File): string | null {
    const result = assetSchema.safeParse(file);
    return result.success ? null : (result.error.issues[0]?.message ?? "Invalid file.");
}
