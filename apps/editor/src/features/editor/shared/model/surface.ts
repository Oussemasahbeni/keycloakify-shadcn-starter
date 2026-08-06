import { LogIn, Mail } from "lucide-react";

/**
 * The two editing surfaces of a single theme. Both are baked into the same
 * exported JAR — this only switches which one the editor is viewing/editing.
 */
export type Surface = "login" | "email";

export type SurfaceOption = {
    value: Surface;
    to: `/editor/${Surface}`;
    label: string;
    icon: typeof LogIn;
};

export const SURFACES = [
    { value: "login", to: "/editor/login", label: "Login", icon: LogIn },
    { value: "email", to: "/editor/email", label: "Email", icon: Mail },
] as const satisfies ReadonlyArray<SurfaceOption>;
