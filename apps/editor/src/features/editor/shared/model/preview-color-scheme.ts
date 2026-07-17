import { Moon, Sun } from "lucide-react";

export type PreviewColorScheme = "light" | "dark";

type SchemeConfig = {
    value: PreviewColorScheme;
    label: string;
    icon: typeof Sun | typeof Moon;
};
export const SCHEMES = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
] as const satisfies ReadonlyArray<SchemeConfig>;
