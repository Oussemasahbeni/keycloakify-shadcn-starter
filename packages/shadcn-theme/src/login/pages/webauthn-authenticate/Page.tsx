import { Input } from "#/components/ui/input";
import { WebAuthnConditionalUI } from "#/login/components/WebAuthnConditionalUi";
import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { clsx } from "keycloakify/tools/clsx";
import { Shield } from "lucide-react";
import { Fragment } from "react";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "webauthn-authenticate.ftl");

    const { kcClsx } = useKcClsx();

    const {
        url,
        realm,
        registrationDisabled,
        authenticators,
        shouldDisplayAuthenticators,
        userVerification,
        createTimeout,
        rpId,
        challenge,
        isUserIdentified,
    } = kcContext;

    const { msg, advancedMsg } = useI18n();

    return (
        <Template
            displayInfo={realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration" className="text-center text-sm">
                    <span>
                        {msg("noAccount")}{" "}
                        <a
                            href={url.registrationUrl}
                            className="text-primary dark:text-foreground hover:text-primary/80 underline underline-offset-4"
                        >
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
            headerNode={msg("webauthn-login-title")}
        >
            <div className="flex flex-col gap-4">
                {authenticators && (
                    <>
                        <form id="authn_select" hidden>
                            {authenticators.authenticators.map(authenticator => (
                                <Input
                                    key={authenticator.credentialId}
                                    type="hidden"
                                    name="authn_use_chk"
                                    value={authenticator.credentialId}
                                />
                            ))}
                        </form>

                        {shouldDisplayAuthenticators && (
                            <div className="flex flex-col gap-4">
                                {authenticators.authenticators.length > 1 && (
                                    <h3 className="text-center text-sm font-medium">
                                        {msg("webauthn-available-authenticators")}
                                    </h3>
                                )}

                                <div className="flex flex-col gap-2">
                                    {authenticators.authenticators.map((authenticator, i) => (
                                        <div
                                            key={authenticator.credentialId}
                                            id={`kc-webauthn-authenticator-item-${i}`}
                                            className="bg-muted/50 flex items-center gap-3 rounded-lg border p-3"
                                        >
                                            <div className="shrink-0">
                                                {(() => {
                                                    const className = kcClsx(authenticator.transports.iconClass as any);
                                                    const isDefaultIcon =
                                                        className === authenticator.transports.iconClass;

                                                    if (isDefaultIcon) {
                                                        return <Shield className="text-muted-foreground size-5" />;
                                                    }

                                                    return <i className={clsx(className, "text-muted-foreground")} />;
                                                })()}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div
                                                    id={`kc-webauthn-authenticator-label-${i}`}
                                                    className="text-sm font-medium"
                                                >
                                                    {advancedMsg(authenticator.label)}
                                                </div>

                                                {authenticator.transports.displayNameProperties?.length && (
                                                    <div
                                                        id={`kc-webauthn-authenticator-transport-${i}`}
                                                        className="text-muted-foreground mt-1 text-xs"
                                                    >
                                                        {authenticator.transports.displayNameProperties.map(
                                                            (displayNameProperty, i, arr) => (
                                                                <Fragment key={displayNameProperty}>
                                                                    {advancedMsg(displayNameProperty)}
                                                                    {i !== arr.length - 1 && <span>, </span>}
                                                                </Fragment>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                                <div className="text-muted-foreground mt-1 text-xs">
                                                    <span id={`kc-webauthn-authenticator-createdlabel-${i}`}>
                                                        {msg("webauthn-createdAt-label")}
                                                    </span>{" "}
                                                    <span id={`kc-webauthn-authenticator-created-${i}`}>
                                                        {authenticator.createdAt}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                <WebAuthnConditionalUI
                    isUserIdentified={isUserIdentified}
                    challenge={challenge}
                    rpId={rpId}
                    userVerification={userVerification}
                    createTimeout={createTimeout}
                    authenticators={authenticators?.authenticators}
                    loginAction={url.loginAction}
                />
            </div>
        </Template>
    );
}
