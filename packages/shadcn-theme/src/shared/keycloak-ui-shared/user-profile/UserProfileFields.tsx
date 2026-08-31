/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/user-profile/UserProfileFields.tsx" --revert
 */

import type {
    UserProfileAttributeGroupMetadata,
    UserProfileAttributeMetadata,
    UserProfileMetadata,
} from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";
import type { TFunction } from "i18next";
import { type JSX, type ReactNode, useEffect, useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { cn } from "#/lib/utils";

import { LocaleSelector } from "./LocaleSelector";
import { MultiInputComponent } from "./MultiInputComponent";
import { OptionComponent } from "./OptionsComponent";
import { SelectComponent } from "./SelectComponent";
import { TextAreaComponent } from "./TextAreaComponent";
import { TextComponent } from "./TextComponent";
import { type UserFormFields, fieldName, isRootAttribute, label } from "./utils";

/** Scroll container of the account console shell (`Root.tsx`); section tracking listens to it. */
// eslint-disable-next-line react/only-export-components -- shared constant next to the component that uses it
export const mainPageContentId = "kc-main-content-page-container";

export type UserProfileError = {
    responseData: { errors?: { errorMessage: string }[] };
};

export type Options = {
    options?: string[];
};

export type InputType =
    | "text"
    | "textarea"
    | "select"
    | "select-radiobuttons"
    | "multiselect"
    | "multiselect-checkboxes"
    | "html5-email"
    | "html5-tel"
    | "html5-url"
    | "html5-number"
    | "html5-range"
    | "html5-datetime-local"
    | "html5-date"
    | "html5-month"
    | "html5-time"
    | "multi-input";

export type UserProfileFieldProps = {
    t: TFunction;
    form: UseFormReturn<UserFormFields>;
    inputType: InputType;
    attribute: UserProfileAttributeMetadata;
    renderer?: (attribute: UserProfileAttributeMetadata) => ReactNode;
};

export type OptionLabel = Record<string, string> | undefined;

// eslint-disable-next-line react/only-export-components -- registry of field components, used by tests
export const FIELDS: {
    [type in InputType]: (props: UserProfileFieldProps) => JSX.Element;
} = {
    text: TextComponent,
    textarea: TextAreaComponent,
    select: SelectComponent,
    "select-radiobuttons": OptionComponent,
    multiselect: SelectComponent,
    "multiselect-checkboxes": OptionComponent,
    "html5-email": TextComponent,
    "html5-tel": TextComponent,
    "html5-url": TextComponent,
    "html5-number": TextComponent,
    "html5-range": TextComponent,
    "html5-datetime-local": TextComponent,
    "html5-date": TextComponent,
    "html5-month": TextComponent,
    "html5-time": TextComponent,
    "multi-input": MultiInputComponent,
} as const;

export type UserProfileFieldsProps = {
    t: TFunction;
    form: UseFormReturn<UserFormFields>;
    userProfileMetadata: UserProfileMetadata;
    supportedLocales: string[];
    currentLocale: string;
    hideReadOnly?: boolean;
    renderer?: (attribute: UserProfileAttributeMetadata) => JSX.Element | undefined;
};

type Section = {
    id: string;
    title: string;
    description?: string;
    attributes: UserProfileAttributeMetadata[];
};

/** Same id scheme as upstream so `jump-link-*` test ids stay stable. */
const sectionId = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

/** Index of the section currently scrolled into view inside the account shell. */
const useActiveSection = (ids: string[]) => {
    const [active, setActive] = useState(0);
    const key = ids.join("|");

    useEffect(() => {
        const scroller = document.getElementById(mainPageContentId);
        if (!scroller || ids.length < 2) {
            return;
        }
        const update = () => {
            const threshold = scroller.getBoundingClientRect().top + 100;
            let current = 0;
            ids.forEach((id, index) => {
                const element = document.getElementById(id);
                if (element && element.getBoundingClientRect().top <= threshold) {
                    current = index;
                }
            });
            setActive(current);
        };
        update();
        scroller.addEventListener("scroll", update, { passive: true });
        return () => scroller.removeEventListener("scroll", update);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- ids compared by value
    }, [key]);

    return active;
};

const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById(`${id}-title`)?.focus({ preventScroll: true });
};

/**
 * Renders the realm's user-profile attributes as form fields, grouped into sections
 * with a sticky jump navigation when the profile defines attribute groups.
 */
export const UserProfileFields = ({
    t,
    form,
    userProfileMetadata,
    supportedLocales,
    currentLocale,
    hideReadOnly = false,
    renderer,
}: UserProfileFieldsProps) => {
    const sections = useMemo<Section[]>(() => {
        if (!userProfileMetadata.attributes) {
            return [];
        }
        const attributes = hideReadOnly
            ? userProfileMetadata.attributes.filter(({ readOnly }) => !readOnly)
            : userProfileMetadata.attributes;

        return [
            // Attributes without a group come first, in an unnamed section.
            { name: undefined } as UserProfileAttributeGroupMetadata,
            ...(userProfileMetadata.groups ?? []),
        ]
            .map(group => ({ group, attributes: attributes.filter(attribute => attribute.group === group.name) }))
            .filter(({ attributes: grouped }) => grouped.length > 0)
            .map(({ group, attributes: grouped }) => {
                const title = label(t, group.displayHeader, group.name) || t("general");
                return {
                    id: sectionId(title),
                    title,
                    description: group.displayDescription ? label(t, group.displayDescription, "") : undefined,
                    attributes: grouped,
                };
            });
    }, [hideReadOnly, userProfileMetadata.groups, userProfileMetadata.attributes, t]);

    const active = useActiveSection(sections.map(section => section.id));

    if (sections.length === 0) {
        return null;
    }

    const showNav = sections.length > 1;

    return (
        <div className={cn("grid gap-8", showNav && "md:grid-cols-[minmax(0,1fr)_12rem]")}>
            <div className="flex flex-col gap-10">
                {sections.map(section => (
                    <section
                        key={section.id}
                        id={section.id}
                        aria-labelledby={showNav ? `${section.id}-title` : undefined}
                        className="flex scroll-mt-4 flex-col gap-5"
                    >
                        {(showNav || section.description) && (
                            <div className="flex flex-col gap-1">
                                {showNav && (
                                    <h2
                                        id={`${section.id}-title`}
                                        tabIndex={-1}
                                        className="text-lg font-semibold tracking-tight outline-none"
                                    >
                                        {section.title}
                                    </h2>
                                )}
                                {section.description && (
                                    <p className="text-sm text-muted-foreground">{section.description}</p>
                                )}
                            </div>
                        )}
                        {section.attributes.map(attribute => (
                            <FormField
                                key={attribute.name}
                                t={t}
                                form={form}
                                supportedLocales={supportedLocales}
                                currentLocale={currentLocale}
                                renderer={renderer}
                                attribute={attribute}
                            />
                        ))}
                    </section>
                ))}
            </div>

            {showNav && (
                <nav aria-label={t("jumpToSection")} className="hidden md:block">
                    <ul className="sticky top-4 flex flex-col border-s border-border">
                        {sections.map((section, index) => (
                            <li key={section.id}>
                                <button
                                    type="button"
                                    data-testid={`jump-link-${section.id}`}
                                    aria-current={active === index ? "location" : undefined}
                                    onClick={() => jumpTo(section.id)}
                                    className={cn(
                                        "-ms-px w-full border-s-2 px-3 py-1.5 text-start text-sm transition-colors",
                                        active === index
                                            ? "border-primary font-medium text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};

type FormFieldProps = {
    t: TFunction;
    form: UseFormReturn<UserFormFields>;
    supportedLocales: string[];
    currentLocale: string;
    attribute: UserProfileAttributeMetadata;
    renderer?: (attribute: UserProfileAttributeMetadata) => JSX.Element | undefined;
};

const FormField = ({ t, form, renderer, supportedLocales, currentLocale, attribute }: FormFieldProps) => {
    const value = form.watch(fieldName(attribute.name));
    const inputType = useMemo(() => determineInputType(attribute), [attribute]);

    const Component =
        attribute.multivalued || (isMultiValue(value) && attribute.annotations?.inputType === undefined)
            ? FIELDS["multi-input"]
            : FIELDS[inputType];

    if (attribute.name === "locale") {
        return (
            <LocaleSelector
                form={form}
                supportedLocales={supportedLocales}
                currentLocale={currentLocale}
                t={t}
                attribute={attribute}
            />
        );
    }

    return <Component t={t} form={form} inputType={inputType} attribute={attribute} renderer={renderer} />;
};

const DEFAULT_INPUT_TYPE = "text" satisfies InputType;

function determineInputType(attribute: UserProfileAttributeMetadata): InputType {
    // Always treat the root attributes as a text field.
    if (isRootAttribute(attribute.name)) {
        return "text";
    }
    const inputType = attribute.annotations?.inputType;
    return isValidInputType(inputType) ? inputType : DEFAULT_INPUT_TYPE;
}

const isValidInputType = (value: unknown): value is InputType => typeof value === "string" && value in FIELDS;

const isMultiValue = (value: unknown): boolean => Array.isArray(value) && value.length > 1;
