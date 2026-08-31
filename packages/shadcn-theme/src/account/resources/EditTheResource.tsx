/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/EditTheResource.tsx" --revert
 */

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { toast } from "#/components/ui/toast";

import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { updatePermissions } from "../api";
import type { Permission, Resource, Scope } from "../api/representations";
import { toastApiError } from "../utils/toastError";

type EditTheResourceProps = {
    resource: Resource;
    permissions?: Permission[];
    onClose: () => void;
};

type FormValues = {
    permissions: Permission[];
};

/** The API returns scopes as names or as `Scope` objects; compare by name either way. */
const scopeName = (scope: Scope | string) => (typeof scope === "string" ? scope : scope.name);

export const EditTheResource = ({ resource, permissions, onClose }: EditTheResourceProps) => {
    const { t } = useTranslation();
    const context = useEnvironment();
    const form = useForm<FormValues>();
    const { control, reset, handleSubmit } = form;
    const { fields } = useFieldArray<FormValues, "permissions">({ control, name: "permissions" });

    // Seeded once on open, like upstream.
    useEffect(() => reset({ permissions }), []);

    const editShares = async ({ permissions: updated }: FormValues) => {
        try {
            await Promise.all(updated.map(permission => updatePermissions(context, resource._id, [permission])));
            toast.add({ title: t("updateSuccess"), type: "success" });
            onClose();
        } catch (error) {
            toastApiError(t, "updateError", error);
        }
    };

    return (
        <Dialog
            open
            onOpenChange={isOpen => {
                if (!isOpen) {
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{t("editTheResource", { name: resource.name })}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {t("editTheResource", { name: resource.name })}
                    </DialogDescription>
                </DialogHeader>

                <form id="edit-form" className="flex flex-col gap-6" onSubmit={handleSubmit(editShares)}>
                    {fields.map((permission, index) => (
                        <div key={permission.id} className="flex flex-col gap-3">
                            <Field>
                                <FieldLabel htmlFor={`permissions-${permission.id}-username`}>{t("user")}</FieldLabel>
                                <Input
                                    id={`permissions-${permission.id}-username`}
                                    value={permissions?.[index]?.username ?? ""}
                                    disabled
                                    readOnly
                                />
                            </Field>
                            <Field>
                                <FieldLabel>{t("permissions")}</FieldLabel>
                                <Controller
                                    name={`permissions.${index}.scopes`}
                                    control={control}
                                    defaultValue={[]}
                                    render={({ field }) => {
                                        const selected = (field.value as (Scope | string)[]).map(scopeName);

                                        return (
                                            <div id={`permissions-${permission.id}`} className="flex flex-col gap-2">
                                                {resource.scopes.map(scope => {
                                                    const id = `permissions-${permission.id}-${scope.name}`;
                                                    const checked = selected.includes(scope.name);

                                                    return (
                                                        <div key={scope.name} className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={id}
                                                                checked={checked}
                                                                onCheckedChange={isChecked =>
                                                                    field.onChange(
                                                                        isChecked
                                                                            ? [...selected, scope.name]
                                                                            : selected.filter(
                                                                                  name => name !== scope.name,
                                                                              ),
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
                                        );
                                    }}
                                />
                            </Field>
                        </div>
                    ))}
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        {t("cancel")}
                    </Button>
                    <Button type="submit" form="edit-form" id="done">
                        {t("done")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
