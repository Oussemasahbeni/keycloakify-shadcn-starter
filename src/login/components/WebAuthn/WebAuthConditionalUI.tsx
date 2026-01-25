import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { useRef } from "react";
import { assert } from "tsafe/assert";
import { useI18n } from '../../i18n';
import { useKcContext } from '../../KcContext';
import { usePasskeysConditionalAuth } from './usePasskeysConditionalAuth';
import { useWebAuthn, type WebAuthnResult } from './useWebAuthn';



export function WebAuthnConditionalUI() {

    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login.ftl");
    const { msgStr } = useI18n();

    const { authenticate } = useWebAuthn();

    const { initAuthenticate } = usePasskeysConditionalAuth();

    const webAuthnFormRef = useRef<HTMLFormElement>(null);
    const clientDataJSONRef = useRef<HTMLInputElement>(null);
    const authenticatorDataRef = useRef<HTMLInputElement>(null);
    const signatureRef = useRef<HTMLInputElement>(null);
    const credentialIdRef = useRef<HTMLInputElement>(null);
    const userHandleRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLInputElement>(null);



    // Define Submission Logic
    const submitWebAuthn = (result: WebAuthnResult) => {
        if (!webAuthnFormRef.current) return;

        if (result.success) {
            if (clientDataJSONRef.current) clientDataJSONRef.current.value = result.clientDataJSON;
            if (authenticatorDataRef.current) authenticatorDataRef.current.value = result.authenticatorData;
            if (signatureRef.current) signatureRef.current.value = result.signature;
            if (credentialIdRef.current) credentialIdRef.current.value = result.credentialId;
            if (userHandleRef.current) userHandleRef.current.value = result.userHandle;
        } else {
            if (errorRef.current) errorRef.current.value = result.error;
        }

        webAuthnFormRef.current.submit();
    };

    // Common Config
    const authOptions = {
        isUserIdentified: kcContext.isUserIdentified === "true",
        challenge: kcContext.challenge,
        userVerification: kcContext.userVerification,
        rpId: kcContext.rpId,
        createTimeout: typeof kcContext.createTimeout === "string"
            ? Number(kcContext.createTimeout)
            : kcContext.createTimeout,
        authenticators: kcContext.authenticators?.authenticators
    };



    const handleWebAuthnClick = async () => {
        const result = await authenticate({
            ...authOptions,
            errmsg: msgStr("webauthn-unsupported-browser-text"),
            mediation: 'optional'
        });
        if (result) submitWebAuthn(result);
    };


    initAuthenticate({
        ...authOptions,
        enabled: kcContext.enableWebAuthnConditionalUI,
        errmsg: msgStr("passkey-unsupported-browser-text"),
        onSuccess: submitWebAuthn
    });

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
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" ref={clientDataJSONRef} />
                <input type="hidden" id="authenticatorData" name="authenticatorData" ref={authenticatorDataRef} />
                <input type="hidden" id="signature" name="signature" ref={signatureRef} />
                <input type="hidden" id="credentialId" name="credentialId" ref={credentialIdRef} />
                <input type="hidden" id="userHandle" name="userHandle" ref={userHandleRef} />
                <input type="hidden" id="error" name="error" ref={errorRef} />
            </form>

            <Button
                id="authenticateWebAuthnButton"
                type="button"
                className="w-full"
                variant="outline"
                onClick={handleWebAuthnClick}
            >
                <Fingerprint className="w-4 h-4" />
                {msgStr("passkey-doAuthenticate")}
            </Button>
        </>
    );
}

