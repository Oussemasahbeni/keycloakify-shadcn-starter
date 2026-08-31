/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/LocaleSelector.tsx" --revert
 */

import { useMemo } from "react";
import { Controller } from "react-hook-form";

import { Field, FieldLabel } from "#/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

import type { UserProfileFieldProps } from "./UserProfileFields";
import { fieldName } from "./utils";
import { toSingle } from "./values";

const localeToDisplayName = (locale: string) => {
    try {
        return new Intl.DisplayNames([locale], { type: "language" }).of(locale);
    } catch {
        return locale;
    }
};

type LocaleSelectorProps = Omit<UserProfileFieldProps, "inputType"> & {
    supportedLocales: string[];
    currentLocale: string;
};

/** The `locale` attribute: realm locales by endonym, plus "default" (empty value). */
export const LocaleSelector = ({ t, form, supportedLocales, currentLocale }: LocaleSelectorProps) => {
    const locales = useMemo(
        () =>
            supportedLocales
                .map(locale => ({
                    key: locale,
                    value: t(`locale_${locale}`, { defaultValue: localeToDisplayName(locale) ?? locale }),
                }))
                // eslint-disable-next-line unicorn/no-array-sort -- freshly mapped array, mutation is local
                .sort((a, b) => a.value.localeCompare(b.value, currentLocale)),
        [supportedLocales, currentLocale, t],
    );

    if (!locales.length) {
        return null;
    }

    const options = [{ key: "", value: t("defaultLocale") }, ...locales];
    const labelOf = (key: string) => options.find(option => option.key === key)?.value ?? key;

    return (
        <Field>
            <FieldLabel htmlFor="locale">{t("selectALocale")}</FieldLabel>
            <Controller
                name={fieldName("locale")}
                control={form.control}
                defaultValue=""
                render={({ field }) => (
                    <Select value={toSingle(field.value)} onValueChange={value => field.onChange(value ?? "")}>
                        <SelectTrigger id="locale" data-testid="locale-select" className="w-full">
                            <SelectValue placeholder={t("defaultLocale")}>
                                {(value: string | null) => (value ? labelOf(value) : t("defaultLocale"))}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {options.map(option => (
                                <SelectItem key={option.key} value={option.key}>
                                    {option.value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
        </Field>
    );
};
