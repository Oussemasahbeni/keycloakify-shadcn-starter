import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";
import { Form } from "./Form";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-reset-password.ftl");

    const { msg } = useI18n();

    return (
        <Template
            displayInfo
            displayMessage={!kcContext.messagesPerField.existsError("username")}
            infoNode={
                kcContext.realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")
            }
            headerNode={msg("emailForgotTitle")}
        >
            <Form />
        </Template>
    );
}
