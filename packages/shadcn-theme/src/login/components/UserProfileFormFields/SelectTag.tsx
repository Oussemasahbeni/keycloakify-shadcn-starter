import { assert } from "tsafe/assert";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

import type { InputFieldByTypeProps } from "./InputFieldByType";
import { InputLabel } from "./InputLabel";

export function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, valueOrValues } = props;

    const isMultiple = attribute.annotations.inputType === "multiselect";

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

            assert(typeof inputOptionsFromValidation === "string");

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[
                inputOptionsFromValidation
            ];

            if (validator === undefined) {
                break walk;
            }

            if (validator.options === undefined) {
                break walk;
            }

            return validator.options;
        }

        return attribute.validators.options?.options ?? [];
    })();

    return (
        <Select
            name={attribute.name}
            multiple={isMultiple}
            disabled={attribute.readOnly}
            // For single selects `null` shows the placeholder; "" would be treated
            // as a real (non-matching) value and hide it.
            value={isMultiple ? valueOrValues : valueOrValues || null}
            onValueChange={value =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    // `value` is string[] when multiple, string | null otherwise.
                    valueOrValues: value ?? "",
                })
            }
            onOpenChange={open => {
                if (open) {
                    return;
                }

                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined,
                });
            }}
        >
            <SelectTrigger id={attribute.name} aria-invalid={displayableErrors.length !== 0} className="w-full">
                <SelectValue>
                    {(value: string | string[] | null) => {
                        if (Array.isArray(value)) {
                            if (value.length === 0) {
                                return null;
                            }

                            return value
                                .map<React.ReactNode>(option => (
                                    <InputLabel key={option} attribute={attribute} option={option} />
                                ))
                                .reduce((prev, curr) => [prev, ", ", curr]);
                        }

                        if (!value) {
                            return null;
                        }

                        return <InputLabel attribute={attribute} option={value} />;
                    }}
                </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
                {options.map(option => (
                    <SelectItem key={option} value={option}>
                        <InputLabel attribute={attribute} option={option} />
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
