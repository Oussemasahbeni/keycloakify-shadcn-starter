import { z } from "zod";

/**
 * Keycloak theme names become directory names inside the JAR, so they must be
 * filesystem/URL safe.
 * Example: `my-theme` is valid, but `My Theme` is not.
 */
export const themeNameSchema = z
    .string()
    .trim()
    .min(1, "Theme name is required.")
    .regex(/^[a-z0-9][a-z0-9-]*$/, "Use lowercase letters, digits and dashes, starting with a letter or digit.");

export function getThemeNameError(name: string): string | null {
    const result = themeNameSchema.safeParse(name);
    return result.success ? null : (result.error.issues[0]?.message ?? "Invalid theme name.");
}
