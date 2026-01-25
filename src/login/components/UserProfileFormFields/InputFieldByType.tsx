import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import type { Attribute } from "@keycloakify/login-ui/KcContext";
import type {
    FormAction,
    FormFieldError
} from "@keycloakify/login-ui/useUserProfileForm";
import { PasswordWrapper } from "../PasswordWrapper";
import { InputTag } from "./InputTag";
import { InputTagSelects } from "./InputTagSelects";
import { SelectTag } from "./SelectTag";
import { TextareaTag } from "./TextareaTag";

export type InputFieldByTypeProps = {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
};

export function InputFieldByType(props: InputFieldByTypeProps) {
    const { attribute, valueOrValues } = props;

    switch (attribute.annotations.inputType) {
        // NOTE: Unfortunately, keycloak won't let you define input type="hidden" in the Admin Console.
        // sometimes in the future it might.
        case "hidden":
            return (
                <input
                    type="hidden"
                    id={attribute.name}
                    name={attribute.name}
                    value={valueOrValues as string}
                />
            );
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
        case "multiselect":
            return <SelectTag {...props} />;
        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return <InputTagSelects {...props} />;
        default: {
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((...[, i]) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </>
                );
            }

            if (attribute.name === "password" || attribute.name === "password-confirm") {
                return (
                    <InputGroup>
                        <InputTag {...props} fieldIndex={undefined} isInGroup={true} />
                        <InputGroupAddon align="inline-end">
                            <PasswordWrapper passwordInputId={attribute.name} />
                        </InputGroupAddon>
                    </InputGroup>
                );
            }

            const inputNode = <InputTag {...props} fieldIndex={undefined} />;

            return inputNode;
        }
    }
}
