import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { Smartphone } from "lucide-react";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-reset-otp.ftl");

    const { kcClsx } = useKcClsx();

    const { url, messagesPerField, configuredOtpCredentials } = kcContext;

    const { msg, msgStr } = useI18n();

    return (
        <Template
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("doLogIn")}
        >
            <form
                id="kc-otp-reset-form"
                className={kcClsx("kcFormClass")}
                action={url.loginAction}
                method="post"
            >
                <div className="flex flex-col gap-4 w-full">
                    <p id="kc-otp-reset-form-description">
                        {msg("otp-reset-description")}
                    </p>

                    <RadioGroup
                        name="selectedCredentialId"
                        defaultValue={configuredOtpCredentials.selectedCredentialId}
                        className="space-y-2"
                    >
                        {configuredOtpCredentials.userOtpCredentials.map(
                            (otpCredential, index) => (
                                <div
                                    key={otpCredential.id}
                                    className="flex items-center space-x-3 p-3 border rounded-lg"
                                >
                                    <Label
                                        htmlFor={`kc-otp-credential-${index}`}
                                        className="flex items-center space-x-2 cursor-pointer flex-1"
                                    >
                                        <Smartphone className="w-5 h-5 text-muted-foreground shrink-0" />
                                        <span className="text-sm font-medium">
                                            {otpCredential.userLabel}
                                        </span>
                                    </Label>
                                    <RadioGroupItem
                                        value={otpCredential.id}
                                        id={`kc-otp-credential-${index}`}
                                    />
                                </div>
                            )
                        )}
                    </RadioGroup>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <div
                            id="kc-form-buttons"
                            className={kcClsx("kcFormButtonsClass")}
                        >
                            <Button
                                id="kc-otp-reset-form-submit"
                                className={"w-full"}
                                type="submit"
                            >
                                {msgStr("doSubmit")}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Template>
    );
}
