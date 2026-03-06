import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { assert } from "tsafe/assert";
import { useI18n } from '../../i18n';
import { useKcContext } from '../../KcContext';
import { useLogic } from './useLogic';


export function WebAuthnConditionalUI() {

    const { kcContext } = useKcContext();

    assert("enableWebAuthnConditionalUI" in kcContext);

    const { msgStr } = useI18n();

    const { webAuthnFormRef, onPasskeyDoAuthenticateClick } = useLogic();

    if (!kcContext.enableWebAuthnConditionalUI) return null;

    return (
        <>
            <form
                id="webauth"
                className='mt-4'
                action={kcContext.url.loginAction}
                method="post"
                ref={webAuthnFormRef}
            >
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>

            <Button
                id="authenticateWebAuthnButton"
                type="button"
                className="w-full"
                variant="outline"
                onClick={onPasskeyDoAuthenticateClick}
            >
                <Fingerprint className="w-4 h-4" />
                {msgStr("passkey-doAuthenticate")}
            </Button>
        </>
    );
}