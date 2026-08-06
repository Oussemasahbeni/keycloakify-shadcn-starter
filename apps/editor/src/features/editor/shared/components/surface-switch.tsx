import { buttonVariants } from "#/components/ui/button";
import { ButtonGroup } from "#/components/ui/button-group";
import { Link } from "@tanstack/react-router";
import { SURFACES } from "../model/surface";

export function SurfaceSwitch() {
    return (
        <ButtonGroup aria-label="Editor surface">
            {SURFACES.map(({ value: surface, label, icon: Icon, to }) => (
                <Link
                    key={surface}
                    to={to}
                    data-slot="button"
                    activeProps={{ className: buttonVariants({ variant: "default", size: "sm" }) }}
                    inactiveProps={{ className: buttonVariants({ variant: "outline", size: "sm" }) }}
                >
                    <Icon data-icon="inline-start" />
                    {label}
                </Link>
            ))}
        </ButtonGroup>
    );
}
