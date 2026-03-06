import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { useRef } from "react";
import { assert } from "tsafe/assert";
import { webAuthnRegister, type WebAuthnRegisterResult } from "./useWebAuthnRegister";

export function useLogic() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "webauthn-register.ftl");

    const { msgStr } = useI18n();

    const registerFormRef = useRef<HTMLFormElement>(null);

    const submitRegister = (result: WebAuthnRegisterResult, label?: string) => {
        const form = registerFormRef.current;
        assert(form !== null);

        const getInput = (name: string) => {
            const input = form.elements.namedItem(name);
            assert(input instanceof HTMLInputElement, `Missing hidden input: ${name}`);
            return input;
        };

        if (result.success) {
            getInput("clientDataJSON").value = result.clientDataJSON;
            getInput("attestationObject").value = result.attestationObject;
            getInput("publicKeyCredentialId").value = result.publicKeyCredentialId;
            getInput("transports").value = result.transports;
            if (label) getInput("authenticatorLabel").value = label;
        } else {
            getInput("error").value = result.error;
        }

        form.submit();
    };

    const onRegisterClick = async () => {
        const result = await webAuthnRegister({
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
            createTimeout:
                typeof kcContext.createTimeout === "string"
                    ? Number(kcContext.createTimeout)
                    : kcContext.createTimeout,
            excludeCredentialIds: kcContext.excludeCredentialIds,
            errmsg: msgStr("webauthn-unsupported-browser-text")
        });

        if (result.success) {
            const initLabel = msgStr("webauthn-registration-init-label");
            const initLabelPrompt = msgStr("webauthn-registration-init-label-prompt");

            let label = window.prompt(initLabelPrompt, initLabel);
            if (label === null) label = initLabel;

            submitRegister(result, label);
        } else {
            submitRegister(result);
        }
    };

    return {
        registerFormRef,
        onRegisterClick
    };
}
