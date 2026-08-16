import { Moon, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PreviewColorScheme = "light" | "dark";

type SchemeConfig = {
    value: PreviewColorScheme;
    label: string;
    icon: LucideIcon;
};
export const SCHEMES = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
] as const satisfies ReadonlyArray<SchemeConfig>;
