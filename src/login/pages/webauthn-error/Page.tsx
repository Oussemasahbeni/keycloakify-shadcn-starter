import { Button } from "@/components/ui/button";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "webauthn-error.ftl");

    const { url, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = useI18n();

    return (
        <Template displayMessage headerNode={msg("webauthn-error-title")}>
            {/* hidden attr excludes it from kc-content space-y sibling margin */}
            <form
                id="kc-error-credential-form"
                hidden
                action={url.loginAction}
                method="post"
            >
                <input
                    type="hidden"
                    id="executionValue"
                    name="authenticationExecution"
                />
                <input type="hidden" id="isSetRetry" name="isSetRetry" />
            </form>

            <Button
                tabIndex={4}
                onClick={() => {
                    // @ts-expect-error: Trusted Keycloak's code
                    document.getElementById("isSetRetry").value = "retry";
                    // @ts-expect-error: Trusted Keycloak's code
                    document.getElementById("executionValue").value = "${execution}";
                    // @ts-expect-error: Trusted Keycloak's code
                    document.getElementById("kc-error-credential-form").submit();
                }}
                type="button"
                className="w-full"
                name="try-again"
                id="kc-try-again"
            >
                {msgStr("doTryAgain")}
            </Button>

            {isAppInitiatedAction && (
                <form
                    action={url.loginAction}
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
        </Template>
    );
}
