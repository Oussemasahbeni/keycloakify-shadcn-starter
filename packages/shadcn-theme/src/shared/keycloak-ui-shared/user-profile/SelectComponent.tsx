/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/SelectComponent.tsx" --revert
 */

import { Controller } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

import type { OptionLabel, Options, UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, label } from "./utils";
import { toArray, toSingle } from "./values";

export const SelectComponent = (props: UserProfileFieldProps) => {
    const { t, form, inputType, attribute } = props;
    const isMultiValue = inputType === "multiselect";

    const options = (attribute.validators?.options as Options | undefined)?.options || [];
    const optionLabel = (attribute.annotations?.["inputOptionLabels"] as OptionLabel) || {};
    const prefix = attribute.annotations?.["inputOptionLabelsI18nPrefix"] as string | undefined;
    const fetchLabel = (option: string) => label(t, optionLabel[option], option, prefix);
    const placeholder = t("selectOne");

    const items = options.map(option => (
        <SelectItem key={option} value={option}>
            {fetchLabel(option)}
        </SelectItem>
    ));

    return (
        <UserProfileGroup {...props}>
            <Controller
                name={fieldName(attribute.name)}
                defaultValue={attribute.defaultValue}
                control={form.control}
                render={({ field }) =>
                    isMultiValue ? (
                        <Select
                            multiple
                            value={toArray(field.value)}
                            onValueChange={value => field.onChange(value)}
                            disabled={attribute.readOnly}
                        >
                            <SelectTrigger id={attribute.name} data-testid={attribute.name} className="w-full">
                                <SelectValue placeholder={placeholder}>
                                    {(value: string[]) =>
                                        value.length > 0 ? value.map(fetchLabel).join(", ") : placeholder
                                    }
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>{items}</SelectContent>
                        </Select>
                    ) : (
                        <Select
                            value={toSingle(field.value)}
                            onValueChange={value => field.onChange(value ?? "")}
                            disabled={attribute.readOnly}
                        >
                            <SelectTrigger id={attribute.name} data-testid={attribute.name} className="w-full">
                                <SelectValue placeholder={placeholder}>
                                    {(value: string | null) => (value ? fetchLabel(value) : placeholder)}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>{items}</SelectContent>
                        </Select>
                    )
                }
            />
        </UserProfileGroup>
    );
};
