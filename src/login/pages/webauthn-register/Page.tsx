import { Button } from "@/components/ui/button";
import { LogoutOtherSessions } from "@/login/components/LogoutOtherSessions";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { useRef } from "react";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";
import { useWebAuthnRegister, type WebAuthnRegisterResult } from "./useWebAuthnRegister";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "webauthn-register.ftl");

    const { msg, msgStr } = useI18n();

    const registerFormRef = useRef<HTMLFormElement>(null);
    const clientDataJSONRef = useRef<HTMLInputElement>(null);
    const attestationObjectRef = useRef<HTMLInputElement>(null);
    const publicKeyCredentialIdRef = useRef<HTMLInputElement>(null);
    const authenticatorLabelRef = useRef<HTMLInputElement>(null);
    const transportsRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLInputElement>(null);

    const { register } = useWebAuthnRegister();

    const submitRegister = (result: WebAuthnRegisterResult, label?: string) => {
        if (!registerFormRef.current) return;

        if (result.success) {
            if (clientDataJSONRef.current) clientDataJSONRef.current.value = result.clientDataJSON;
            if (attestationObjectRef.current) attestationObjectRef.current.value = result.attestationObject;
            if (publicKeyCredentialIdRef.current) publicKeyCredentialIdRef.current.value = result.publicKeyCredentialId;
            if (transportsRef.current) transportsRef.current.value = result.transports;
            if (authenticatorLabelRef.current && label) authenticatorLabelRef.current.value = label;
        } else {
            if (errorRef.current) errorRef.current.value = result.error;
        }

        registerFormRef.current.submit();
    };

    // Click Handler
    const handleRegisterClick = async () => {
        const result = await register({
            challenge: kcContext.challenge,
            userid: kcContext.userid,
            username: kcContext.username,
            signatureAlgorithms: kcContext.signatureAlgorithms,
            rpEntityName: kcContext.rpEntityName,
            rpId: kcContext.rpId,
            attestationConveyancePreference: kcContext.attestationConveyancePreference,
            authenticatorAttachment: kcContext.authenticatorAttachment,
            requireResidentKey: kcContext.requireResidentKey,
            userVerificationRequirement: kcContext.userVerificationRequirement,
            createTimeout: typeof kcContext.createTimeout === 'string' ? Number(kcContext.createTimeout) : kcContext.createTimeout,
            excludeCredentialIds: kcContext.excludeCredentialIds,
            errmsg: msgStr("webauthn-unsupported-browser-text")
        });

        if (result.success) {
            const initLabel = msgStr("webauthn-registration-init-label");
            const initLabelPrompt = msgStr("webauthn-registration-init-label-prompt");

            let labelResult = window.prompt(initLabelPrompt, initLabel);
            if (labelResult === null) {
                labelResult = initLabel;
            }

            submitRegister(result, labelResult);
        } else {
            // Handle error
            submitRegister(result);
        }
    };

    return (
        <Template
            headerNode={
                <div className="flex items-center justify-center gap-2">
                    <span>{msg("webauthn-registration-title")}</span>
                </div>
            }
        >
            <div className="space-y-6">
                {/* HIDDEN FORM */}
                <form
                    id="register"
                    action={kcContext.url.loginAction}
                    method="post"
                    ref={registerFormRef}
                >
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" ref={clientDataJSONRef} />
                    <input type="hidden" id="attestationObject" name="attestationObject" ref={attestationObjectRef} />
                    <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" ref={publicKeyCredentialIdRef} />
                    <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" ref={authenticatorLabelRef} />
                    <input type="hidden" id="transports" name="transports" ref={transportsRef} />
                    <input type="hidden" id="error" name="error" ref={errorRef} />
                </form>

                <LogoutOtherSessions />

                <div className="space-y-3">
                    <Button
                        type="button"
                        className="w-full"
                        id="authenticateWebAuthnButton"
                        onClick={handleRegisterClick}
                    >
                        {msgStr("doRegisterSecurityKey")}
                    </Button>

                    {!kcContext.isSetRetry && kcContext.isAppInitiatedAction && (
                        <form
                            action={kcContext.url.loginAction}
                            id="kc-webauthn-settings-form"
                            method="post"
                        >
                            <Button
                                type="submit"
                                variant="outline"
                                className="w-full"
                                id="cancelWebAuthnAIA"
                                name="cancel-aia"
                                value="true"
                            >
                                {msgStr("doCancel")}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}