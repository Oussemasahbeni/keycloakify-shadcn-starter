/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/MultiInputComponent.tsx" --revert
 */

import type { TFunction } from "i18next";
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react";
import { type ComponentProps, useEffect, useMemo } from "react";
import { type FieldPath, type UseFormReturn, useWatch } from "react-hook-form";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

import type { InputType, UserProfileFieldProps } from "./UserProfileFields";
import { UserProfileGroup } from "./UserProfileGroup";
import { type UserFormFields, fieldName, labelAttribute } from "./utils";

export const MultiInputComponent = ({ t, form, attribute, renderer, inputType }: UserProfileFieldProps) => (
    <UserProfileGroup t={t} form={form} attribute={attribute} renderer={renderer}>
        <MultiLineInput
            t={t}
            form={form}
            inputType={inputType}
            id={attribute.name}
            aria-label={labelAttribute(t, attribute)}
            name={fieldName(attribute.name)}
            defaultValue={[attribute.defaultValue ?? ""]}
            addButtonLabel={t("addMultivaluedLabel", { fieldLabel: labelAttribute(t, attribute) })}
            disabled={attribute.readOnly}
        />
    </UserProfileGroup>
);

export type MultiLineInputProps = Omit<ComponentProps<"input">, "form" | "name" | "defaultValue"> & {
    t: TFunction;
    name: FieldPath<UserFormFields>;
    form: UseFormReturn<UserFormFields>;
    addButtonLabel?: string;
    defaultValue?: string[];
    inputType: InputType;
};

/** One input per value with remove buttons and an "add" button after the last row. */
const MultiLineInput = ({
    t,
    name,
    inputType,
    form,
    addButtonLabel,
    disabled = false,
    defaultValue,
    id,
    ...rest
}: MultiLineInputProps) => {
    const { register, setValue, control } = form;
    const value = useWatch({ name, control });

    const fields = useMemo<string[]>(
        () => (Array.isArray(value) && value.length !== 0 ? value.map(String) : defaultValue || [""]),
        [value, defaultValue],
    );

    const update = (values: string[]) => {
        // The path is generic over the whole form, so the value type can't be narrowed here.
        setValue(name, values as never, { shouldDirty: true });
    };
    const remove = (index: number) => update([...fields.slice(0, index), ...fields.slice(index + 1)]);
    const append = () => update([...fields, ""]);
    const updateValue = (index: number, next: string) =>
        update([...fields.slice(0, index), next, ...fields.slice(index + 1)]);

    const type = inputType.startsWith("html") ? inputType.substring("html".length + 2) : "text";

    useEffect(() => {
        register(name);
    }, [register, name]);

    return (
        <div id={id} className="flex flex-col gap-2">
            {fields.map((fieldValue, index) => (
                // eslint-disable-next-line react/no-array-index-key -- values are positional
                <div key={index} className="flex items-center gap-2">
                    <Input
                        data-testid={name + index}
                        name={`${name}.${index}.value`}
                        value={fieldValue}
                        disabled={disabled}
                        type={type}
                        onChange={event => updateValue(index, event.target.value)}
                        className="flex-1"
                        {...rest}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        data-testid={"remove" + index}
                        tabIndex={-1}
                        aria-label={t("remove")}
                        disabled={fields.length === 1 || disabled}
                        onClick={() => remove(index)}
                    >
                        <MinusCircleIcon />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="self-start"
                data-testid="addValue"
                tabIndex={-1}
                aria-label={t("add")}
                disabled={!fields[fields.length - 1] || disabled}
                onClick={append}
            >
                <PlusCircleIcon data-icon="inline-start" />
                {addButtonLabel || t("add")}
            </Button>
        </div>
    );
};
