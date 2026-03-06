import { Button } from "@/components/ui/button";
import { LogoutOtherSessions } from "@/login/components/LogoutOtherSessions";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";
import { useLogic } from './useLogic';

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "webauthn-register.ftl");

    const { msg, msgStr } = useI18n();

    const {
        registerFormRef,
        onRegisterClick,
    } = useLogic();
    ;

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
                    <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                    <input type="hidden" id="attestationObject" name="attestationObject" />
                    <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                    <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                    <input type="hidden" id="transports" name="transports" />
                    <input type="hidden" id="error" name="error" />
                </form>

                <LogoutOtherSessions />

                <div className="space-y-3">
                    <Button
                        type="button"
                        className="w-full"
                        id="authenticateWebAuthnButton"
                        onClick={onRegisterClick}
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