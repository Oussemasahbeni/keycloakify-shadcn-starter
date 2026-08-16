import { useInsertScriptTags } from "@keycloakify/login-ui/tools/useInsertScriptTags";
import { waitForElementMountedOnDom } from "@keycloakify/login-ui/tools/waitForElementMountedOnDom";
import { useEffect } from "react";
import { assert } from "tsafe/assert";

import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";

export function useScript(params: { webAuthnButtonId: string }) {
    const { webAuthnButtonId } = params;

    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-passkeys-conditional-authenticate.ftl");

    const { msgStr, isFetchingTranslations } = useI18n();

    const { insertScriptTags } = useInsertScriptTags({
        effectId: "LoginRecoveryAuthnCodeConfig",
        scriptTags: [
            {
                type: "module",
                textContent: () => `
                    import { authenticateByWebAuthn } from "${import.meta.env.BASE_URL}keycloak-theme/login/js/webauthnAuthenticate.js";
                    import { initAuthenticate } from "${import.meta.env.BASE_URL}keycloak-theme/login/js/passkeysConditionalAuth.js";

                    const authButton = document.getElementById("${webAuthnButtonId}");
                    const input = {
                        isUserIdentified : ${kcContext.isUserIdentified},
                        challenge : ${JSON.stringify(kcContext.challenge)},
                        userVerification : ${JSON.stringify(kcContext.userVerification)},
                        rpId : ${JSON.stringify(kcContext.rpId)},
                        createTimeout : ${kcContext.createTimeout}
                    };
                    authButton.addEventListener("click", () => {
                        authenticateByWebAuthn({
                            ...input,
                            errmsg : ${JSON.stringify(msgStr("webauthn-unsupported-browser-text"))}
                        });
                    });

                    initAuthenticate({
                        ...input,
                        errmsg : ${JSON.stringify(msgStr("passkey-unsupported-browser-text"))}
                    });
                `,
            },
        ],
    });

    useEffect(() => {
        if (isFetchingTranslations) {
            return;
        }

        void (async () => {
            await waitForElementMountedOnDom({
                elementId: webAuthnButtonId,
            });

            insertScriptTags();
        })();
    }, [isFetchingTranslations]);
}
