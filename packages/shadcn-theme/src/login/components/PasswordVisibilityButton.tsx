import { Button } from "#/components/ui/button";
import { useI18n } from "#/login/i18n";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function PasswordVisibilityButton(props: { passwordInputId: string; }) {
    const { passwordInputId } = props;

    const { msgStr } = useI18n();

    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
        passwordInputId,
    });

    return (
        <Button
            type="button"
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
