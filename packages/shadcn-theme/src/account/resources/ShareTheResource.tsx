/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/ShareTheResource.tsx" --revert
 */

import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { toast } from "#/components/ui/toast";

import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { updateRequest } from "../api";
import type { Permission, Resource } from "../api/representations";
import { toastApiError } from "../utils/toastError";
import { SharedWithList } from "./SharedWithAvatars";

type ShareTheResourceProps = {
    resource: Resource;
    permissions?: Permission[];
    open: boolean;
    onClose: () => void;
};

type FormValues = {
    permissions: string[];
    usernames: { value: string }[];
};

export const ShareTheResource = ({ resource, permissions, open, onClose }: ShareTheResourceProps) => {
    const { t } = useTranslation();
    const context = useEnvironment();
    const form = useForm<FormValues>();
    const {
        control,
        register,
        reset,
        formState: { errors, isValid },
        setError,
        clearErrors,
        handleSubmit,
    } = form;
    const { fields, append, remove } = useFieldArray<FormValues>({ control, name: "usernames" });

    // Always keep one (empty) username field to type into.
    useEffect(() => {
        if (fields.length === 0) {
            append({ value: "" });
        }
    }, [fields]);

    const watchFields = useWatch({ control, name: "usernames", defaultValue: [] });
    const isDisabled = watchFields.every(({ value }) => value.trim().length === 0);

    const addShare = async ({ usernames, permissions: scopes }: FormValues) => {
        try {
            await Promise.all(
                usernames
                    .filter(({ value }) => value !== "")
                    .map(({ value: username }) => updateRequest(context, resource._id, username, scopes)),
            );
            toast.add({ title: t("shareSuccess"), type: "success" });
            onClose();
        } catch (error) {
            toastApiError(t, "shareError", error);
        }
        reset({});
    };

    const validateUser = async () => {
        const userOrEmails = fields.map(f => f.value).filter(f => f !== "");
        const userPermission = permissions?.map(p => [p.username, p.email]).flat();

        const hasUsers = userOrEmails.length > 0;
        const alreadyShared = userOrEmails.filter(u => userPermission?.includes(u)).length !== 0;

        if (!hasUsers || alreadyShared) {
            setError("usernames", { message: !hasUsers ? t("required") : t("resourceAlreadyShared") });
        } else {
            clearErrors();
        }

        return hasUsers && !alreadyShared;
    };

    const usernameError = errors.usernames?.message;

    return (
        <Dialog
            open={open}
            onOpenChange={isOpen => {
                if (!isOpen) {
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{t("shareTheResource", { name: resource.name })}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {t("shareTheResource", { name: resource.name })}
                    </DialogDescription>
                </DialogHeader>

                <form id="share-form" className="flex flex-col gap-5" onSubmit={handleSubmit(addShare)}>
                    <Field data-invalid={usernameError ? true : undefined}>
                        <FieldLabel htmlFor="users">
                            {t("shareUser")}
                            <span aria-hidden="true" className="text-destructive">
                                *
                            </span>
                        </FieldLabel>
                        <div className="flex items-center gap-2">
                            <Input
                                id="users"
                                data-testid="users"
                                placeholder={t("usernamePlaceholder")}
                                aria-invalid={usernameError ? true : undefined}
                                {...register(`usernames.${fields.length - 1}.value`, { validate: validateUser })}
                            />
                            <Button
                                key="add-user"
                                type="button"
                                variant="outline"
                                data-testid="add"
                                disabled={isDisabled}
                                onClick={() => append({ value: "" })}
                            >
                                {t("add")}
                            </Button>
                        </div>
                        {fields.length > 1 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs text-muted-foreground">{t("shareWith")}</span>
                                {fields.map(
                                    (field, index) =>
                                        index !== fields.length - 1 && (
                                            <Badge key={field.id} variant="secondary" className="gap-1 pe-1">
                                                {field.value}
                                                <button
                                                    type="button"
                                                    aria-label={`${t("remove", { defaultValue: "Remove" })} ${field.value}`}
                                                    className="rounded-full hover:text-destructive"
                                                    onClick={() => remove(index)}
                                                >
                                                    <XIcon className="size-3" />
                                                </button>
                                            </Badge>
                                        ),
                                )}
                            </div>
                        )}
                        {usernameError && <FieldError>{usernameError}</FieldError>}
                    </Field>

                    <Field data-testid="permissions">
                        <FieldLabel>{t("permissions")}</FieldLabel>
                        <Controller
                            name="permissions"
                            control={control}
                            defaultValue={[]}
                            render={({ field }) => (
                                <div id="permissions-selected" className="flex flex-col gap-2">
                                    {resource.scopes.map(scope => {
                                        const id = `share-scope-${scope.name}`;
                                        const checked = field.value.includes(scope.name);

                                        return (
                                            <div key={scope.name} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={id}
                                                    checked={checked}
                                                    onCheckedChange={isChecked =>
                                                        field.onChange(
                                                            isChecked
                                                                ? [...field.value, scope.name]
                                                                : field.value.filter(name => name !== scope.name),
                                                        )
                                                    }
                                                />
                                                <Label htmlFor={id} className="font-normal">
                                                    {scope.displayName || scope.name}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        />
                    </Field>

                    {permissions?.some(user => user.scopes.length > 0) && (
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">
                                {t("sharedWith", { defaultValue: "Shared with" })}
                            </span>
                            <SharedWithList permissions={permissions} />
                        </div>
                    )}
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        {t("cancel")}
                    </Button>
                    <Button type="submit" form="share-form" data-testid="done" disabled={!isValid}>
                        {t("done")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
