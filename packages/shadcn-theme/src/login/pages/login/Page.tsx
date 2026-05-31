import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";
import { Form } from "./Form";
import { Info } from "./Info";
import { SocialProviders } from "./SocialProviders";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login.ftl");

    const { msg } = useI18n();

    return (
        <Template
            displayMessage={
                !kcContext.messagesPerField.existsError("username", "password")
            }
            headerNode={msg("loginAccountTitle")}
            displayInfo={
                kcContext.realm.password &&
                kcContext.realm.registrationAllowed &&
                !kcContext.registrationDisabled
            }
            infoNode={<Info />}
            socialProvidersNode={
                kcContext.realm.password &&
                kcContext.social !== undefined && <SocialProviders />
            }
        >
            <Form />
        </Template>
    );
}
