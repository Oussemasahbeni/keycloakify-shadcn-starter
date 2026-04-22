import { Input } from "@/components/ui/input";
import { WebAuthnConditionalUI } from '@/login/components/WebAuthnConditionalUi';
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
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
                            tabIndex={6}
                            href={url.registrationUrl}
                            className="text-primary dark:text-white hover:text-primary/80 underline underline-offset-4"
                        >
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
            headerNode={msg("webauthn-login-title")}
        >
            <div className="space-y-4">

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
                            <div className="space-y-4">
                                {authenticators.authenticators.length > 1 && (
                                    <h3 className="text-sm font-medium text-center">
                                        {msg("webauthn-available-authenticators")}
                                    </h3>
                                )}

                                <div className="space-y-2">
                                    {authenticators.authenticators.map(
                                        (authenticator, i) => (
                                            <div
                                                key={i}
                                                id={`kc-webauthn-authenticator-item-${i}`}
                                                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
                                            >
                                                <div className="shrink-0">
                                                    {(() => {
                                                        const className = kcClsx(
                                                            authenticator.transports
                                                                .iconClass as any
                                                        );
                                                        const isDefaultIcon =
                                                            className ===
                                                            authenticator.transports
                                                                .iconClass;

                                                        if (isDefaultIcon) {
                                                            return (
                                                                <Shield className="w-5 h-5 text-muted-foreground" />
                                                            );
                                                        }

                                                        return (
                                                            <i
                                                                className={clsx(
                                                                    className,
                                                                    "text-muted-foreground"
                                                                )}
                                                            />
                                                        );
                                                    })()}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div
                                                        id={`kc-webauthn-authenticator-label-${i}`}
                                                        className="font-medium text-sm"
                                                    >
                                                        {advancedMsg(authenticator.label)}
                                                    </div>

                                                    {authenticator.transports
                                                        .displayNameProperties
                                                        ?.length && (
                                                            <div
                                                                id={`kc-webauthn-authenticator-transport-${i}`}
                                                                className="text-xs text-muted-foreground mt-1"
                                                            >
                                                                {authenticator.transports.displayNameProperties
                                                                    .map(
                                                                        (
                                                                            displayNameProperty,
                                                                            i,
                                                                            arr
                                                                        ) => ({
                                                                            displayNameProperty,
                                                                            hasNext:
                                                                                i !==
                                                                                arr.length - 1
                                                                        })
                                                                    )
                                                                    .map(
                                                                        ({
                                                                            displayNameProperty,
                                                                            hasNext
                                                                        }) => (
                                                                            <Fragment
                                                                                key={
                                                                                    displayNameProperty
                                                                                }
                                                                            >
                                                                                {advancedMsg(
                                                                                    displayNameProperty
                                                                                )}
                                                                                {hasNext && (
                                                                                    <span>
                                                                                        ,{" "}
                                                                                    </span>
                                                                                )}
                                                                            </Fragment>
                                                                        )
                                                                    )}
                                                            </div>
                                                        )}

                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        <span
                                                            id={`kc-webauthn-authenticator-createdlabel-${i}`}
                                                        >
                                                            {msg(
                                                                "webauthn-createdAt-label"
                                                            )}
                                                        </span>{" "}
                                                        <span
                                                            id={`kc-webauthn-authenticator-created-${i}`}
                                                        >
                                                            {authenticator.createdAt}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
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
