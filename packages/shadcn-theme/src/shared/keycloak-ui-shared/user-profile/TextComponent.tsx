/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/TextComponent.tsx" --revert
 */

import { Input } from "#/components/ui/input";

import type { UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, isRequiredAttribute, label } from "./utils";

export const TextComponent = (props: UserProfileFieldProps) => {
    const { form, inputType, attribute } = props;
    // "html5-email" → "email", plain "text" otherwise.
    const type = inputType.startsWith("html") ? inputType.substring("html".length + 2) : "text";

    return (
        <UserProfileGroup {...props}>
            <Input
                id={attribute.name}
                data-testid={attribute.name}
                type={type}
                placeholder={
                    attribute.readOnly
                        ? ""
                        : label(
                              props.t,
                              attribute.annotations?.["inputTypePlaceholder"] as string | undefined,
                              "",
                              attribute.annotations?.["inputOptionLabelsI18nPrefix"] as string | undefined,
                          )
                }
                disabled={attribute.readOnly}
                required={isRequiredAttribute(attribute)}
                defaultValue={attribute.defaultValue}
                {...form.register(fieldName(attribute.name))}
            />
        </UserProfileGroup>
    );
};
