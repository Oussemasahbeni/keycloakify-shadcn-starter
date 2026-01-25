import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from "@/components/ui/label";
import { PasswordWrapper } from "@/login/components/PasswordWrapper";
import { WebAuthnConditionalUI } from '@/login/components/WebAuthn/WebAuthConditionalUI';
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useState } from "react";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-password.ftl");


    const { msg, msgStr } = useI18n();

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            headerNode={msg("doLogIn")}
            displayMessage={!kcContext.messagesPerField.existsError("password")}
        >
            <form
                id="kc-form-login"
                onSubmit={() => {
                    setIsLoginButtonDisabled(true);
                    return true;
                }}
                action={kcContext.url.loginAction}
                className="flex flex-col gap-4"
                method="post"
            >
                <Field>
                    <FieldLabel htmlFor="password">{msg("password")}</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            tabIndex={2}
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            aria-invalid={kcContext.messagesPerField.existsError(
                                "password"
                            )}
                        />
                        <InputGroupAddon align="inline-end">
                            <PasswordWrapper passwordInputId="password" />
                        </InputGroupAddon>
                    </InputGroup>
                    {kcContext.messagesPerField.existsError("password") && (
                        <FieldError>
                            <span
                                id="input-error"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(
                                        kcContext.messagesPerField.getFirstError(
                                            "password"
                                        )
                                    )
                                }}
                            />
                        </FieldError>
                    )}
                </Field>

                <div className="flex justify-end">
                    {kcContext.realm.resetPasswordAllowed && (
                        <span className=" underline-offset-4 hover:underline">
                            <a tabIndex={5} href={kcContext.url.loginResetCredentialsUrl}>
                                <Label className="text-sm font-medium cursor-pointer">
                                    {msg("doForgotPassword")}
                                </Label>
                            </a>
                        </span>
                    )}
                </div>

                <div className="flex justify-end ">
                    <Button
                        disabled={isLoginButtonDisabled}
                        className="w-full"
                        name="login"
                        type="submit"
                        tabIndex={4}
                    >
                        {msgStr("doLogIn")}
                    </Button>
                </div>
            </form>


            <WebAuthnConditionalUI />

        </Template>
    );
}
