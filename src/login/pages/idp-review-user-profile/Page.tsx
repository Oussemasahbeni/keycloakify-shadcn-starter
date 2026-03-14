import { Button } from "@/components/ui/button";
import { useKcContext } from "@/login/KcContext";
import { useState } from "react";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";
import { UserProfileFormFields } from "../../components/UserProfileFormFields";
import { useI18n } from "../../i18n";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "idp-review-user-profile.ftl");

    const { msg, msgStr } = useI18n();

    const [isFomSubmittable, setIsFomSubmittable] = useState(false);

    return (
        <Template
            displayMessage={kcContext.messagesPerField.exists("global")}
            displayRequiredFields
            headerNode={msg("loginIdpReviewProfileTitle")}
        >
            <form
                id="kc-idp-review-profile-form"
                action={kcContext.url.loginAction}
                method="post"
                className="flex flex-col gap-4"
            >
                <UserProfileFormFields
                    onIsFormSubmittableValueChange={setIsFomSubmittable}
                />

                <div id="kc-form-buttons">
                    <Button
                        className="w-full"
                        disabled={!isFomSubmittable}
                        type="submit"
                    >
                        {msgStr("doSubmit")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
