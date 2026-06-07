import { Checkbox } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { cn } from "#/lib/utils";
import { assert } from "tsafe/assert";
import type { InputFieldByTypeProps } from "./InputFieldByType";
import { InputLabel } from "./InputLabel";

export function InputTagSelects(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, valueOrValues } = props;

    const isRadio = (() => {
        const { inputType } = attribute.annotations;

        assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");

        return inputType === "select-radiobuttons";
    })();

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

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

    if (isRadio) {
        return (
            <RadioGroup
                value={typeof valueOrValues === "string" ? valueOrValues : ""}
                onValueChange={value =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: value,
                    })
                }
                disabled={attribute.readOnly}
                className="flex flex-col gap-2"
            >
                {options.map(option => (
                    <div key={option} className="flex items-center gap-2">
                        <RadioGroupItem
                            value={option}
                            id={`${attribute.name}-${option}`}
                            aria-invalid={props.displayableErrors.length !== 0}
                            onBlur={() =>
                                dispatchFormAction({
                                    action: "focus lost",
                                    name: attribute.name,
                                    fieldIndex: undefined,
                                })
                            }
                        />
                        <Label
                            htmlFor={`${attribute.name}-${option}`}
                            className={cn(
                                "text-sm font-normal",
                                attribute.readOnly && "opacity-50 cursor-not-allowed",
                            )}
                        >
                            <InputLabel attribute={attribute} option={option} />
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {options.map(option => (
                <div key={option} className="flex items-center gap-2">
                    <Checkbox
                        id={`${attribute.name}-${option}`}
                        checked={
                            valueOrValues instanceof Array
                                ? valueOrValues.includes(option)
                                : valueOrValues === option
                        }
                        disabled={attribute.readOnly}
                        onCheckedChange={checked =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: (() => {
                                    const isChecked = checked === true;

                                    if (valueOrValues instanceof Array) {
                                        const newValues = [...valueOrValues];

                                        if (isChecked) {
                                            newValues.push(option);
                                        } else {
                                            newValues.splice(newValues.indexOf(option), 1);
                                        }

                                        return newValues;
                                    }

                                    return isChecked ? option : "";
                                })(),
                            })
                        }
                        onBlur={() =>
                            dispatchFormAction({
                                action: "focus lost",
                                name: attribute.name,
                                fieldIndex: undefined,
                            })
                        }
                    />
                    <Label
                        htmlFor={`${attribute.name}-${option}`}
                        className={cn(
                            "text-sm font-normal",
                            attribute.readOnly && "opacity-50 cursor-not-allowed",
                        )}
                    >
                        <InputLabel attribute={attribute} option={option} />
                    </Label>
                </div>
            ))}
        </div>
    );
}
