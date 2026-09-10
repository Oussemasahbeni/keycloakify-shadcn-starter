import { Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PreviewColorScheme = "light" | "dark";

/**
 * Map the editor chrome theme onto a preview scheme. The chrome theme can be
 * `"system"` (and always is on the first render, before localStorage is read),
 * but the theme presets are keyed only by `"light"` / `"dark"`.
 */
export function resolvePreviewColorScheme(theme: "light" | "dark" | "system"): PreviewColorScheme {
    if (theme !== "system") return theme;
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

type SchemeConfig = {
    value: PreviewColorScheme;
    label: string;
    icon: LucideIcon;
};
export const SCHEMES = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
] as const satisfies ReadonlyArray<SchemeConfig>;
