import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clsx } from "keycloakify/tools/clsx";
import { useState } from "react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { WebAuthnConditionalUI } from '@/login/components/WebAuthn/WebAuthConditionalUI';
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

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
    } = kcContext;

    const { msg, msgStr } = useI18n();

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    ;

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
                            className="text-primary dark:text-primary-foreground underline underline-offset-4 "
                            tabIndex={8}
                            href={url.registrationUrl}
                        >
                            {msg("doRegister")}
                        </a>
                    </span>
                </div>
            }
            headerNode={msg("doLogIn")}
            socialProvidersNode={
                <>
                    {realm.password &&
                        social?.providers !== undefined &&
                        social.providers.length !== 0 && (
                            <div id="kc-social-providers" className="space-y-4">
                                <div className="text-center">
                                    <h2 className="text-sm font-medium text-muted-foreground">
                                        {msg("identity-provider-login-label")}
                                    </h2>
                                </div>
                                <div
                                    className={clsx(
                                        "grid gap-2",
                                        social.providers.length > 3
                                            ? "grid-cols-2"
                                            : "grid-cols-1"
                                    )}
                                >
                                    {social.providers.map(p => (
                                        <a
                                            key={p.alias}
                                            id={`social-${p.alias}`}
                                            className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && (
                                                <i
                                                    className={clsx(p.iconClasses)}
                                                    aria-hidden="true"
                                                ></i>
                                            )}
                                            <span className="text-sm font-medium">
                                                {p.displayName}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                </>
            }
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
                                    className="autofill:bg-background"
                                    autoComplete="username"
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

                <WebAuthnConditionalUI />

            </div>
        </Template>
    );
}
