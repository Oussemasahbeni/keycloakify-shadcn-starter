import { Button } from "#/components/ui/button";
import { ButtonGroup } from "#/components/ui/button-group";
import { LogIn, Mail } from "lucide-react";
import { useEditor } from "../../state/editor-context";

/**
 * The two editing surfaces of a single theme. Both are baked into the same
 * exported JAR — this only switches which one the editor is viewing/editing.
 */
export type Surface = "login" | "email";

interface SurfaceOption {
    value: Surface;
    label: string;
    icon: typeof LogIn;
}

const SURFACES = [
    { value: "login", label: "Login", icon: LogIn },
    { value: "email", label: "Email", icon: Mail },
] as const satisfies ReadonlyArray<SurfaceOption>;

export function SurfaceSwitch() {
    const { activeSurface, setActiveSurface } = useEditor();
    return (
        <ButtonGroup>
            {SURFACES.map(({ value: surface, label, icon: Icon }) => {
                const isActive = activeSurface === surface;
                return (
                    <Button
                        key={surface}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        aria-pressed={isActive}
                        onClick={() => setActiveSurface(surface)}
                    >
                        <Icon className="size-4" />
                        {label}
                    </Button>
                );
            })}
        </ButtonGroup>
    );
}
