import { Button } from "#/components/ui/button";
import { ButtonGroup } from "#/components/ui/button-group";
import { useEditor } from "../../state/editor-context";
import { SURFACES } from "../model/surface";

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
