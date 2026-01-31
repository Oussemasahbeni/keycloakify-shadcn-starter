import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from "@/components/ui/label";
import { useKcContext } from "@/login/KcContext";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { Fingerprint } from "lucide-react";
import { useState } from "react";
import { assert } from "tsafe/assert";
import { PasswordWrapper } from "../../components/PasswordWrapper";
import { useI18n } from "../../i18n";
import { useScript } from "./useScript";

export function Form() {
    const { kcContext } = useKcContext();

    assert(kcContext.pageId === "login.ftl");

    const { msg, msgStr } = useI18n();

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const { kcClsx } = useKcClsx();

    const webAuthnButtonId = "authenticateWebAuthnButton";

    useScript({ webAuthnButtonId });

    return (
        <>
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {kcContext.realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={kcContext.url.loginAction}
                            method="post"
                            className="space-y-3"
                        >
                            {!kcContext.usernameHidden && (
                                <Field>
                                    <FieldLabel htmlFor="username">
                                        {!kcContext.realm.loginWithEmailAllowed
                                            ? msg("email")
                                            : !kcContext.realm.registrationEmailAsUsername
                                                ? msg("usernameOrEmail")
                                                : msg("username")}
                                    </FieldLabel>
                                    <Input
                                        tabIndex={2}
                                        type="text"
                                        id="username"
                                        defaultValue={kcContext.login.username ?? ""}
                                        name="username"
                                        autoFocus
                                        autoComplete="username"
                                        aria-invalid={kcContext.messagesPerField.existsError(
                                            "username",
                                            "password"
                                        )}
                                    />
                                    {kcContext.messagesPerField.existsError(
                                        "username",
                                        "password"
                                    ) && (
                                            <FieldError>
                                                <span
                                                    id="input-error"
                                                    aria-live="polite"
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(
                                                            kcContext.messagesPerField.getFirstError(
                                                                "username",
                                                                "password"
                                                            )
                                                        )
                                                    }}
                                                />
                                            </FieldError>
                                        )}
                                </Field>
                            )}

                            <Field>
                                <FieldLabel htmlFor="password">
                                    {msg("password")}
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        tabIndex={3}
                                        type="password"
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        aria-invalid={kcContext.messagesPerField.existsError(
                                            "username",
                                            "password"
                                        )}
                                    />
                                    <InputGroupAddon align="inline-end" >
                                        <PasswordWrapper
                                            passwordInputId="password" tabIndex={4} />
                                    </InputGroupAddon>
                                </InputGroup>
                                {kcContext.messagesPerField.existsError(
                                    "username",
                                    "password"
                                ) && (
                                        <FieldError>
                                            <span
                                                id="input-error"
                                                aria-live="polite"
                                                dangerouslySetInnerHTML={{
                                                    __html: kcSanitize(
                                                        kcContext.messagesPerField.getFirstError(
                                                            "username",
                                                            "password"
                                                        )
                                                    )
                                                }}
                                            />
                                        </FieldError>
                                    )}
                            </Field>

                            <div className=" space-y-1 my-3 flex justify-between text-xs  ">
                                {kcContext.realm.rememberMe &&
                                    !kcContext.usernameHidden && (
                                        <div className="flex items-center space-x-2 ">
                                            <Checkbox
                                                tabIndex={5}
                                                id="rememberMe"
                                                name="rememberMe"
                                                defaultChecked={
                                                    !!kcContext.login.rememberMe
                                                }
                                            />

                                            <Label
                                                htmlFor="rememberMe"
                                                className="text-sm font-medium cursor-pointer"
                                            >
                                                {msg("rememberMe")}
                                            </Label>
                                        </div>
                                    )}
                                <div className="link-style ">
                                    {kcContext.realm.resetPasswordAllowed && (
                                        <span className=" underline-offset-4 hover:underline">
                                            <a
                                                tabIndex={6}
                                                href={
                                                    kcContext.url.loginResetCredentialsUrl
                                                }
                                            >
                                                <Label className="text-sm font-medium cursor-pointer">
                                                    {msg("doForgotPassword")}
                                                </Label>
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={kcClsx("kcFormGroupClass")}>
                                <input
                                    type="hidden"
                                    id="id-hidden-input"
                                    name="credentialId"
                                    value={kcContext.auth.selectedCredential}
                                />

                                <Button
                                    disabled={isLoginButtonDisabled}
                                    className="w-full"
                                    tabIndex={7}
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                    value={msgStr("doLogIn")}
                                >
                                    {msgStr("doLogIn")}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {kcContext.enableWebAuthnConditionalUI && (
                <>
                    <form id="webauth" action={kcContext.url.loginAction} method="post">
                        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                        <input
                            type="hidden"
                            id="authenticatorData"
                            name="authenticatorData"
                        />
                        <input type="hidden" id="signature" name="signature" />
                        <input type="hidden" id="credentialId" name="credentialId" />
                        <input type="hidden" id="userHandle" name="userHandle" />
                        <input type="hidden" id="error" name="error" />
                    </form>

                    {kcContext.authenticators !== undefined &&
                        kcContext.authenticators.authenticators.length !== 0 && (
                            <>
                                <form id="authn_select" className={kcClsx("kcFormClass")}>
                                    {kcContext.authenticators.authenticators.map(
                                        (authenticator, i) => (
                                            <input
                                                key={i}
                                                type="hidden"
                                                name="authn_use_chk"
                                                readOnly
                                                value={authenticator.credentialId}
                                            />
                                        )
                                    )}
                                </form>
                            </>
                        )}
                    <br />

                    <Button
                        id={webAuthnButtonId}
                        type="button"
                        className="w-full"
                        variant="outline"
                    >
                        <Fingerprint className="w-4 h-4" />
                        {msgStr("passkey-doAuthenticate")}
                    </Button>
                </>
            )}
        </>
    );
}
