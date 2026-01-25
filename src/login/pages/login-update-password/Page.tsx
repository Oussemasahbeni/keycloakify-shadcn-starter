import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { LogoutOtherSessions } from "@/login/components/LogoutOtherSessions";
import { PasswordWrapper } from "@/login/components/PasswordWrapper";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-update-password.ftl");

    const { msg, msgStr } = useI18n();

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    return (
        <Template
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
        >
            <form
                id="kc-passwd-update-form"
                className="space-y-6"
                action={url.loginAction}
                method="post"
            >
                <Field>
                    <FieldLabel htmlFor="password-new">{msg("passwordNew")}</FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            type="password"
                            id="password-new"
                            name="password-new"
                            autoFocus
                            autoComplete="new-password"
                            aria-invalid={messagesPerField.existsError("password")}
                        />
                        <InputGroupAddon align="inline-end">
                            <PasswordWrapper passwordInputId="password-new" />
                        </InputGroupAddon>
                    </InputGroup>
                    {messagesPerField.existsError("password") && (
                        <FieldError>
                            <span
                                id="input-error"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(
                                        messagesPerField.getFirstError("password")
                                    )
                                }}
                            />
                        </FieldError>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="password-confirm">
                        {msg("passwordConfirm")}
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            type="password"
                            id="password-confirm"
                            name="password-confirm"
                            autoComplete="new-password"
                            aria-invalid={messagesPerField.existsError(
                                "password-confirm"
                            )}
                        />
                        <InputGroupAddon align="inline-end">
                            <PasswordWrapper passwordInputId="password-confirm" />
                        </InputGroupAddon>
                    </InputGroup>
                    {messagesPerField.existsError("password-confirm") && (
                        <FieldError>
                            <span
                                id="input-error"
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(
                                        messagesPerField.getFirstError("password-confirm")
                                    )
                                }}
                            />
                        </FieldError>
                    )}
                </Field>

                <LogoutOtherSessions />

                <div className="space-y-3">
                    <Button className="w-full" type="submit">
                        {msgStr("doSubmit")}
                    </Button>
                    {isAppInitiatedAction && (
                        <Button
                            variant="outline"
                            className="w-full"
                            type="submit"
                            name="cancel-aia"
                            value="true"
                        >
                            {msg("doCancel")}
                        </Button>
                    )}
                </div>
            </form>
        </Template>
    );
}
