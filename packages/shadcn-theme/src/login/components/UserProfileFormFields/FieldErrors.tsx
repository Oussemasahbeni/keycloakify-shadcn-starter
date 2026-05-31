import { FieldError } from "#/components/ui/field";
import type { Attribute } from "@keycloakify/login-ui/KcContext";
import type { FormFieldError } from "@keycloakify/login-ui/useUserProfileForm";
import { Fragment } from "react";

export function FieldErrors(props: {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    fieldIndex: number | undefined;
}) {
    const { attribute, fieldIndex } = props;

    const displayableErrors = props.displayableErrors.filter(
        error => error.fieldIndex === fieldIndex
    );

    if (displayableErrors.length === 0) {
        return null;
    }

    return (
        <FieldError
            id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
        >
            {displayableErrors.map(({ errorMessage }, i, arr) => (
                <Fragment key={i}>
                    {errorMessage}
                    {arr.length - 1 !== i && <br />}
                </Fragment>
            ))}
        </FieldError>
    );
}
