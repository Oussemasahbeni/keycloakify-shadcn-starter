import type { LucideIcon } from "lucide-react";
import { Monitor, Smartphone, Tablet } from "lucide-react";

export type Viewport = "desktop" | "tablet" | "mobile";

type ViewportConfig = {
    id: Viewport;
    label: string;
    icon: LucideIcon;
    /** Max width of the preview in px. `null` = fill available space. */
    width: number | null;
};

export const VIEWPORTS = [
    { id: "desktop", label: "Desktop", icon: Monitor, width: null },
    { id: "tablet", label: "Tablet", icon: Tablet, width: 768 },
    { id: "mobile", label: "Mobile", icon: Smartphone, width: 375 },
] as const satisfies ReadonlyArray<ViewportConfig>;

export function getViewportWidth(viewport: Viewport): number | null {
    return VIEWPORTS.find(entry => entry.id === viewport)?.width ?? null;
}
