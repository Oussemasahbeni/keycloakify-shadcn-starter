/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/OptionsComponent.tsx" --revert
 */

import { Controller } from "react-hook-form";

import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldLabel } from "#/components/ui/field";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";

import type { OptionLabel, Options, UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { fieldName, label } from "./utils";
import { toArray } from "./values";

/** `select-radiobuttons` → radio group, `multiselect-checkboxes` → checkbox list. */
export const OptionComponent = (props: UserProfileFieldProps) => {
    const { form, inputType, attribute } = props;
    const isMultiSelect = inputType.startsWith("multiselect");

    const options = (attribute.validators?.options as Options | undefined)?.options || [];
    const optionLabel = (attribute.annotations?.["inputOptionLabels"] as OptionLabel) || {};
    const prefix = attribute.annotations?.["inputOptionLabelsI18nPrefix"] as string | undefined;
    const fetchLabel = (option: string) => label(props.t, optionLabel[option], option, prefix);

    return (
        <UserProfileGroup {...props}>
            <Controller
                name={fieldName(attribute.name)}
                control={form.control}
                defaultValue={attribute.defaultValue}
                render={({ field }) => {
                    const selected = toArray(field.value);

                    if (isMultiSelect) {
                        return (
                            <fieldset className="flex flex-col gap-2">
                                {options.map(option => (
                                    <Field key={option} orientation="horizontal">
                                        <Checkbox
                                            id={option}
                                            data-testid={option}
                                            value={option}
                                            checked={selected.includes(option)}
                                            disabled={attribute.readOnly}
                                            onCheckedChange={checked =>
                                                field.onChange(
                                                    checked
                                                        ? [...selected, option]
                                                        : selected.filter(item => item !== option),
                                                )
                                            }
                                        />
                                        <FieldLabel htmlFor={option} className="font-normal">
                                            {fetchLabel(option)}
                                        </FieldLabel>
                                    </Field>
                                ))}
                            </fieldset>
                        );
                    }

                    return (
                        <RadioGroup
                            value={selected[0] ?? ""}
                            onValueChange={value => field.onChange([String(value)])}
                            disabled={attribute.readOnly}
                            className="flex flex-col gap-2"
                        >
                            {options.map(option => (
                                <Field key={option} orientation="horizontal">
                                    <RadioGroupItem id={option} data-testid={option} value={option} />
                                    <FieldLabel htmlFor={option} className="font-normal">
                                        {fetchLabel(option)}
                                    </FieldLabel>
                                </Field>
                            ))}
                        </RadioGroup>
                    );
                }}
            />
        </UserProfileGroup>
    );
};
