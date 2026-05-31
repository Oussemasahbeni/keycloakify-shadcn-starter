import { Button } from "#/components/ui/button";
import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { useState } from "react";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";
import { UserProfileFormFields } from "../../components/UserProfileFormFields";
import { LogoutOtherSessions } from "#/login/components/LogoutOtherSessions";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "update-email.ftl");

    const { msg, msgStr } = useI18n();

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    return (
        <Template
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
            headerNode={msg("updateEmailTitle")}
        >
            <form
                id="kc-update-email-form"
                className="space-y-6"
                action={url.loginAction}
                method="post"
            >
                <UserProfileFormFields
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                />

                <LogoutOtherSessions />

                <div className="space-y-3">
                    <Button
                        disabled={!isFormSubmittable}
                        className="w-full"
                        type="submit"
                    >
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
