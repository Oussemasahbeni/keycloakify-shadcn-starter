/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/personal-info/PersonalInfo.tsx" --revert
 */

import { SquareArrowOutUpRight } from "lucide-react";
import { useEffect } from "react";
import { type ErrorOption, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "#/components/ui/button";
import { Spinner } from "#/components/ui/spinner";
import { toast } from "#/components/ui/toast";

import { type AccountEnvironment } from "..";
import {
    UserProfileFields,
    beerify,
    debeerify,
    setUserProfileServerError,
    useEnvironment,
} from "../../shared/keycloak-ui-shared";
import { savePersonalInfo } from "../api/methods";
import { accountKeys, useAccountMutation, usePersonalInfo, useSupportedLocales } from "../api/queries";
import type { UserProfileMetadata, UserRepresentation } from "../api/representations";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Page } from "../components/page/Page";

/** Shape of the validation errors Keycloak returns for a rejected profile update. */
type ServerFieldError = { field: string; errorMessage: string; params?: unknown[] };

export const PersonalInfo = () => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const { data: personalInfo } = usePersonalInfo();
    const { data: supportedLocales = [] } = useSupportedLocales();
    const userProfileMetadata: UserProfileMetadata | undefined = personalInfo?.userProfileMetadata;
    const form = useForm<UserRepresentation>({ mode: "onChange" });
    const { handleSubmit, reset, setValue, setError } = form;

    // (Re)seed the form whenever the profile is (re)loaded — on first load and after a save.
    useEffect(() => {
        if (!personalInfo) {
            return;
        }
        reset(personalInfo);
        Object.entries(personalInfo.attributes || {}).forEach(([k, v]) => setValue(`attributes[${beerify(k)}]`, v));
    }, [personalInfo, reset, setValue]);

    const save = useAccountMutation(
        async (api, user: UserRepresentation) => {
            const attributes = Object.fromEntries(
                Object.entries(user.attributes || {}).map(([k, v]) => [debeerify(k), v]),
            );
            await savePersonalInfo(api, { ...user, attributes });
            return attributes;
        },
        {
            invalidates: [accountKeys.personalInfo()],
            onSuccess: async attributes => {
                const locale = attributes["locale"]?.toString();
                if (locale) {
                    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { language: locale } }));
                }
                await context.keycloak.updateToken();
                toast.add({ title: t("accountUpdatedMessage"), type: "success" });
            },
            onError: error => {
                toast.add({ title: t("accountUpdatedError"), type: "error" });
                setUserProfileServerError(
                    { responseData: { errors: error as ServerFieldError[] } },
                    (name: string | number, fieldError: unknown) => setError(name as string, fieldError as ErrorOption),
                    t,
                );
            },
        },
    );
    const onSubmit = (user: UserRepresentation) => save.mutate(user);

    if (!userProfileMetadata) {
        return (
            <div className="flex justify-center p-8">
                <Spinner className="size-6" />
            </div>
        );
    }

    const allFieldsReadOnly = userProfileMetadata.attributes.every(attribute => attribute.readOnly);

    const {
        updateEmailFeatureEnabled,
        updateEmailActionEnabled,
        isRegistrationEmailAsUsername,
        isEditUserNameAllowed,
        deleteAccountAllowed,
    } = context.environment.features;

    return (
        <Page title={t("personalInfo")} description={t("personalInfoDescription")}>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
                <UserProfileFields
                    form={form}
                    userProfileMetadata={userProfileMetadata}
                    supportedLocales={supportedLocales}
                    currentLocale={context.environment.locale}
                    t={t}
                    renderer={attribute => {
                        const annotations = attribute.annotations ?? {};
                        return attribute.name === "email" &&
                            updateEmailFeatureEnabled &&
                            updateEmailActionEnabled &&
                            annotations["kc.required.action.supported"] &&
                            (!isRegistrationEmailAsUsername || isEditUserNameAllowed) ? (
                            <Button
                                id="update-email-btn"
                                variant="ghost"
                                onClick={() => context.keycloak.login({ action: "UPDATE_EMAIL" })}
                            >
                                {t("updateEmail")}
                                <SquareArrowOutUpRight data-icon="inline-end" />
                            </Button>
                        ) : undefined;
                    }}
                />
                {!allFieldsReadOnly && (
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button data-testid="cancel" id="cancel-btn" variant="outline" onClick={() => reset()}>
                            {t("cancel")}
                        </Button>
                        <Button data-testid="save" type="submit" id="save-btn" disabled={save.isPending}>
                            {t("save")}
                        </Button>
                    </div>
                )}
            </form>
            {deleteAccountAllowed && (
                <section
                    data-testid="delete-account"
                    aria-labelledby="delete-account-title"
                    className="mt-8 flex flex-col gap-4 rounded-(--radius) border border-destructive/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex flex-col gap-1">
                        <h2 id="delete-account-title" className="text-base font-semibold text-destructive">
                            {t("deleteAccount")}
                        </h2>
                        <p className="text-sm text-muted-foreground">{t("deleteAccountWarning")}</p>
                    </div>
                    <ConfirmDialog
                        trigger={<Button id="delete-account-btn" variant="destructive" />}
                        label={t("deleteAccount")}
                        title={t("deleteAccount")}
                        description={t("deleteAccountWarning")}
                        confirmLabel={t("delete")}
                        cancelLabel={t("cancel")}
                        destructive
                        onConfirm={() => context.keycloak.login({ action: "delete_account" })}
                    />
                </section>
            )}
        </Page>
    );
};

export default PersonalInfo;
