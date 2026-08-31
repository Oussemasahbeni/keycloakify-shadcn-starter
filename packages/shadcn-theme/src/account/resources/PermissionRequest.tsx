/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/PermissionRequest.tsx" --revert
 */

import { UserCheckIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { toast } from "#/components/ui/toast";

import { fetchPermission, updateRequest } from "../api";
import { accountKeys, useAccountMutation } from "../api/queries";
import type { Permission, Resource, Scope } from "../api/representations";
import { toastApiError } from "../utils/toastError";

const scopeName = (scope: Scope | string) => (typeof scope === "string" ? scope : scope.name);

type PermissionRequestProps = {
    resource: Resource;
};

export const PermissionRequest = ({ resource }: PermissionRequestProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    const respond = useAccountMutation(
        async (context, { shareRequest, approve }: { shareRequest: Permission; approve: boolean }) => {
            const permissions = await fetchPermission({ context }, resource._id);
            const { scopes, username } = permissions.find(p => p.username === shareRequest.username) || {
                scopes: [],
                username: shareRequest.username,
            };
            await updateRequest(
                context,
                resource._id,
                username,
                approve ? [...(scopes as string[]), ...(shareRequest.scopes as string[])] : scopes,
            );
        },
        {
            invalidates: [accountKeys.resources()],
            onSuccess: () => {
                toast.add({ title: t("shareSuccess"), type: "success" });
                toggle();
            },
            onError: error => toastApiError(t, "shareError", error),
        },
    );
    const approveDeny = (shareRequest: Permission, approve = false) => respond.mutate({ shareRequest, approve });

    const requests = resource.shareRequests ?? [];

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={toggle}
                aria-label={t("permissionRequest", { name: resource.name })}
            >
                <UserCheckIcon data-icon="inline-start" />
                <Badge variant="secondary">{requests.length}</Badge>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{t("permissionRequest", { name: resource.name })}</DialogTitle>
                        <DialogDescription className="sr-only">{t("permissionRequests")}</DialogDescription>
                    </DialogHeader>
                    <div className="rounded-(--radius) border border-border">
                        <Table aria-label={t("resources")}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("requestor")}</TableHead>
                                    <TableHead>{t("permissionRequests")}</TableHead>
                                    <TableHead className="w-px">
                                        <span className="sr-only">{t("accept")}</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map(shareRequest => (
                                    <TableRow key={shareRequest.username}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {shareRequest.firstName} {shareRequest.lastName}{" "}
                                                    {shareRequest.lastName ? "" : shareRequest.username}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {shareRequest.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="whitespace-normal">
                                            <div className="flex flex-wrap gap-1">
                                                {shareRequest.scopes.map(scope => (
                                                    <Badge key={scopeName(scope)} variant="outline">
                                                        {scopeName(scope)}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    disabled={respond.isPending}
                                                    onClick={() => approveDeny(shareRequest, true)}
                                                >
                                                    {t("accept")}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => approveDeny(shareRequest)}
                                                >
                                                    {t("deny")}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={toggle}>
                            {t("close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
