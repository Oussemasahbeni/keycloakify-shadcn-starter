/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/TextAreaComponent.tsx" --revert
 */

import { Textarea } from "#/components/ui/textarea";

import type { UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, isRequiredAttribute } from "./utils";

export const TextAreaComponent = (props: UserProfileFieldProps) => {
    const { form, attribute } = props;

    return (
        <UserProfileGroup {...props}>
            <Textarea
                id={attribute.name}
                data-testid={attribute.name}
                cols={attribute.annotations?.["inputTypeCols"] as number | undefined}
                rows={attribute.annotations?.["inputTypeRows"] as number | undefined}
                readOnly={attribute.readOnly}
                disabled={attribute.readOnly}
                required={isRequiredAttribute(attribute)}
                defaultValue={attribute.defaultValue}
                {...form.register(fieldName(attribute.name))}
            />
        </UserProfileGroup>
    );
};
