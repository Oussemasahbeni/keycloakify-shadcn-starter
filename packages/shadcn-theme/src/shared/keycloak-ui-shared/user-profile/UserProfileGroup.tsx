/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/UserProfileGroup.tsx" --revert
 */

import type { UserProfileAttributeMetadata } from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import type { TFunction } from "i18next";
import { get } from "lodash-es";
import type { PropsWithChildren, ReactNode } from "react";
import type { FieldError, UseFormReturn } from "react-hook-form";

import { Field, FieldLabel } from "#/components/ui/field";

import { FormErrorText } from "../controls/FormErrorText";
import { HelpItem } from "../controls/HelpItem";
import { type UserFormFields, fieldName, isRequiredAttribute, label, labelAttribute } from "./utils";

export type UserProfileGroupProps = {
    t: TFunction;
    form: UseFormReturn<UserFormFields>;
    attribute: UserProfileAttributeMetadata;
    renderer?: (attribute: UserProfileAttributeMetadata) => ReactNode;
};

/** Label + optional help popover + control (+ optional extra element from `renderer`) + server/client error. */
export const UserProfileGroup = ({
    t,
    form,
    attribute,
    renderer,
    children,
}: PropsWithChildren<UserProfileGroupProps>) => {
    const helpText = label(t, attribute.annotations?.["inputHelperTextBefore"] as string | undefined);
    const error = get(form.formState.errors, fieldName(attribute.name)) as FieldError | undefined;
    const extra = renderer?.(attribute);

    return (
        <Field data-invalid={error ? true : undefined}>
            <div className="flex items-center gap-1.5">
                <FieldLabel htmlFor={attribute.name}>
                    {labelAttribute(t, attribute) || ""}
                    {isRequiredAttribute(attribute) && (
                        <span aria-hidden="true" className="text-destructive">
                            *
                        </span>
                    )}
                </FieldLabel>
                {helpText && <HelpItem helpText={helpText} fieldLabelId={attribute.name ?? ""} />}
            </div>
            {extra ? (
                <div className="flex items-start gap-2 [&>*:first-child]:flex-1">
                    {children}
                    {extra}
                </div>
            ) : (
                children
            )}
            {error && <FormErrorText data-testid={`${attribute.name}-helper`} message={error.message ?? ""} />}
        </Field>
    );
};
