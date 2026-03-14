import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useState } from "react";
import { MdOutlineDevices } from "react-icons/md";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();

    assert(kcContext.pageId === "login-otp.ftl");

    const { msg, msgStr } = useI18n();

    const [isSubmitting, setIsSubmitting] = useState(false);
    return (
        <Template
            displayMessage={!kcContext.messagesPerField.existsError("totp")}
            headerNode={msg("doLogIn")}
        >
            <form
                id="kc-otp-login-form"
                className="space-y-6"
                action={kcContext.url.loginAction}
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
                method="post"
            >
                {kcContext.otpLogin.userOtpCredentials.length > 1 && (
                    <div className="space-y-3">
                        <RadioGroup
                            name="selectedCredentialId"
                            defaultValue={kcContext.otpLogin.selectedCredentialId}
                            className="space-y-2"
                        >
                            {kcContext.otpLogin.userOtpCredentials.map(
                                (otpCredential, index) => (
                                    <div
                                        key={otpCredential.id}
                                        className="flex items-center space-x-3 p-3 border rounded-lg"
                                    >
                                        <RadioGroupItem
                                            value={otpCredential.id}
                                            id={`kc-otp-credential-${index}`}
                                        />
                                        <Label
                                            htmlFor={`kc-otp-credential-${index}`}
                                            className="flex items-center space-x-2 cursor-pointer flex-1"
                                        >
                                            <MdOutlineDevices />
                                            <span className="text-sm font-medium">
                                                {otpCredential.userLabel}
                                            </span>
                                        </Label>
                                    </div>
                                )
                            )}
                        </RadioGroup>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium  block">
                        {msg("loginOtpOneTime")}
                    </Label>
                    <div className="flex w-72">
                        <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            name="otp"
                            autoFocus
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                                <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                                <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                                <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                                <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                                <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {kcContext.messagesPerField.existsError("totp") && (
                        <FieldError id="input-error-otp-code">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(
                                        kcContext.messagesPerField.get("totp")
                                    )
                                }}
                            />
                        </FieldError>
                    )}
                </div>

                <Button
                    className="w-full"
                    name="login"
                    id="kc-login"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {msgStr("doLogIn")}
                </Button>
            </form>
        </Template>
    );
}
