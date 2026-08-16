import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { Button } from "#/components/ui/button";
import { useI18n } from "#/login/i18n";

export function PasswordVisibilityButton(props: { passwordInputId: string }) {
    const { passwordInputId } = props;

    const { msgStr } = useI18n();

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
        passwordInputId,
    });

    return (
        <Button
            type="button"
            // oxlint-disable-next-line jsx-a11y/tabindex-no-positive -- mirrors Keycloak's base theme tab order (username=1, password=2, submit=3, toggle=4)
            tabIndex={4}
            variant="ghost"
            size="icon-sm"
            aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
            aria-controls={passwordInputId}
            onClick={toggleIsPasswordRevealed}
        >
            {isPasswordRevealed ? <FiEye /> : <FiEyeOff />}
        </Button>
    );
}
