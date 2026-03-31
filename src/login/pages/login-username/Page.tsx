import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { WebAuthnConditionalUI } from '@/login/components/WebAuthnConditionalUi';
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";
import { SocialProviders } from "../login/SocialProviders";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-username.ftl");

    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        registrationDisabled,
        messagesPerField,
        enableWebAuthnConditionalUI,
    } = kcContext;

    const { msg, msgStr } = useI18n();

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const showPlaceholder = kcContext.properties.SHADCN_THEME_PLACEHOLDER === "true";

    return (
        <Template
            displayMessage={!messagesPerField.existsError("username")}
            displayInfo={
                realm.password && realm.registrationAllowed && !registrationDisabled
            }
            infoNode={
                <div id="kc-registration" className="text-center text-sm">
                    <span>
                        {msg("noAccount")}{" "}
                        <a
                            className="underline underline-offset-4 "
                            tabIndex={8}
                            href={url.registrationUrl}
                        >
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
            headerNode={msg("doLogIn")}
            socialProvidersNode={realm.password && social !== undefined && <SocialProviders />}
        >
            <div>
                {realm.password && (
                    <form
                        id="kc-form-login"
                        className="space-y-4"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                    >
                        {!usernameHidden && (
                            <Field>
                                <FieldLabel htmlFor="username">
                                    {!realm.loginWithEmailAllowed
                                        ? msg("email")
                                        : !realm.registrationEmailAsUsername
                                            ? msg("usernameOrEmail")
                                            : msg("username")}
                                </FieldLabel>
                                <Input
                                    tabIndex={2}
                                    type="text"
                                    id="username"
                                    defaultValue={login.username ?? ""}
                                    name="username"
                                    autoFocus
                                    placeholder={
                                        showPlaceholder
                                            ? !realm.loginWithEmailAllowed
                                                ? msgStr("usernamePlaceholder")
                                                : !realm.registrationEmailAsUsername
                                                    ? msgStr("usernameOrEmailPlaceholder")
                                                    : msgStr("emailPlaceholder")
                                            : undefined
                                    }
                                    className="autofill:bg-background"
                                    autoComplete={enableWebAuthnConditionalUI ? "username webauthn" : "username"}
                                    aria-invalid={messagesPerField.existsError(
                                        "username"
                                    )}
                                />
                                {messagesPerField.existsError("username") && (
                                    <FieldError>
                                        <span
                                            id="input-error"
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(
                                                    messagesPerField.getFirstError(
                                                        "username"
                                                    )
                                                )
                                            }}
                                        />
                                    </FieldError>
                                )}
                            </Field>
                        )}

                        {realm.rememberMe && !usernameHidden && (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    tabIndex={3}
                                    id="rememberMe"
                                    name="rememberMe"
                                    value="on"
                                    defaultChecked={!!login.rememberMe}
                                />
                                <Label
                                    htmlFor="rememberMe"
                                    className="text-sm font-medium cursor-pointer"
                                >
                                    {msg("rememberMe")}
                                </Label>
                            </div>
                        )}

                        <Button
                            disabled={isLoginButtonDisabled}
                            className="w-full"
                            name="login"
                            type="submit"
                            tabIndex={4}
                        >
                            {msgStr("doLogIn")}
                        </Button>
                    </form>
                )}

                {kcContext.enableWebAuthnConditionalUI && <WebAuthnConditionalUI
                    isUserIdentified={kcContext.isUserIdentified}
                    challenge={kcContext.challenge}
                    rpId={kcContext.rpId}
                    userVerification={kcContext.userVerification}
                    createTimeout={kcContext.createTimeout}
                    authenticators={kcContext.authenticators?.authenticators}
                    loginAction={kcContext.url.loginAction} />}
            </div>
        </Template>
    );
}
