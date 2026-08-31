/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/ResourcesTab.tsx" --revert
 */

import { useQueryClient } from "@tanstack/react-query";
import { EllipsisVerticalIcon, ExternalLinkIcon, PencilIcon, Share2Icon, Unlink2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Badge } from "#/components/ui/badge";
import { Button, buttonVariants } from "#/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { toast } from "#/components/ui/toast";
import { cn } from "#/lib/utils";

import { updatePermissions } from "../api";
import { accountKeys, useAccountMutation, useResources } from "../api/queries";
import type { Resource } from "../api/representations";
import { DataTableToolbar } from "../components/DataTableToolbar";
import { TableEmptyRow, TableLoadingRow } from "../components/TableStates";
import { toastApiError } from "../utils/toastError";
import { EditTheResource } from "./EditTheResource";
import { PermissionRequest } from "./PermissionRequest";
import { SharedWithAvatars } from "./SharedWithAvatars";
import { ShareTheResource } from "./ShareTheResource";

/**
 * The resources API returns the client's `baseUrl` as stored (often relative, e.g. "/") without
 * resolving it against `rootUrl`. Resolve relative values against the Keycloak origin rather than
 * the document `<base>`, which points at the theme's resources folder (or the Vite dev server).
 */
const clientUrl = (baseUrl: string | undefined) =>
    baseUrl ? new URL(baseUrl, window.location.origin).href : undefined;

/** Which popup is open for a resource, keyed by resource id. */
type OpenState = {
    contextOpen?: boolean;
    shareDialogOpen?: boolean;
    editDialogOpen?: boolean;
};

type ResourcesTabProps = {
    isShared?: boolean;
};

export const ResourcesTab = ({ isShared = false }: ResourcesTabProps) => {
    const { t } = useTranslation();

    const [params, setParams] = useState<Record<string, string>>({ first: "0", max: "5" });
    const [open, setOpen] = useState<Record<string, OpenState | undefined>>({});
    const [unshareTarget, setUnshareTarget] = useState<Resource>();
    const queryClient = useQueryClient();

    // One query per page of resources; for owned resources it also carries who they are shared
    // with and pending requests, so the table can show both inline.
    const { data } = useResources(isShared, params);
    const resources = data?.resources;
    const hasNext = data?.hasNext ?? false;
    const permissions = data?.permissions ?? {};

    const unshare = useAccountMutation(
        (context, resource: Resource) =>
            updatePermissions(
                context,
                resource._id,
                (permissions[resource._id] ?? []).map(({ username }) => ({ username, scopes: [] })),
            ),
        {
            invalidates: [accountKeys.resources()],
            onSuccess: () => toast.add({ title: t("unShareSuccess"), type: "success" }),
            onError: error => toastApiError(t, "unShareError", error),
        },
    );

    // Functional update: picking a menu item sets a dialog flag and closes the menu in the same
    // tick, and the second update must not clobber the first with a stale snapshot.
    const toggleOpen = (id: string, field: keyof OpenState, isOpen: boolean) =>
        setOpen(prev => ({ ...prev, [id]: { ...prev[id], [field]: isOpen } }));

    /** Dialogs may have changed who a resource is shared with. */
    const closeDialogs = () => {
        setOpen({});
        void queryClient.invalidateQueries({ queryKey: accountKeys.resources() });
    };

    const columnCount = isShared ? 3 : 5;

    return (
        <div className="flex flex-col gap-4">
            <DataTableToolbar
                onSearch={name => setParams({ ...params, first: "0", name })}
                searchPlaceholder={t("filterByName")}
                first={parseInt(params["first"])}
                perPage={parseInt(params["max"])}
                perPageOptions={[5, 10, 20]}
                count={resources?.length ?? 0}
                hasNext={hasNext}
                onFirstChange={first => setParams({ ...params, first: String(first) })}
                onPerPageChange={max => setParams({ ...params, first: "0", max: String(max) })}
            />

            <div className="rounded-(--radius) border border-border bg-card text-card-foreground">
                <Table aria-label={t("resources")}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("resourceName")}</TableHead>
                            <TableHead>{t("application")}</TableHead>
                            {isShared ? (
                                <TableHead>{t("permissions")}</TableHead>
                            ) : (
                                <>
                                    <TableHead>{t("sharedWith", { defaultValue: "Shared with" })}</TableHead>
                                    <TableHead>{t("permissionRequests")}</TableHead>
                                    <TableHead className="w-px">
                                        <span className="sr-only">{t("share")}</span>
                                    </TableHead>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!resources && <TableLoadingRow colSpan={columnCount} />}
                        {resources?.length === 0 && (
                            <TableEmptyRow colSpan={columnCount}>
                                {t("noResources", { defaultValue: "No resources" })}
                            </TableEmptyRow>
                        )}
                        {resources?.map((resource, index) => {
                            const state = open[resource._id];
                            const shared = permissions[resource._id];
                            const hasShares = shared?.some(user => user.scopes.length > 0) ?? false;

                            return (
                                <TableRow key={resource._id}>
                                    <TableCell data-testid={`row[${index}].name`} className="font-medium">
                                        {resource.name}
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={clientUrl(resource.client.baseUrl)}
                                            className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                                        >
                                            {resource.client.name || resource.client.clientId}
                                            <ExternalLinkIcon data-icon="inline-end" />
                                        </a>
                                    </TableCell>
                                    {isShared ? (
                                        <TableCell className="whitespace-normal">
                                            {resource.scopes.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-1">
                                                    {resource.scopes.map(scope => (
                                                        <Badge key={scope.name} variant="outline">
                                                            {scope.displayName || scope.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </TableCell>
                                    ) : (
                                        <>
                                            <TableCell>
                                                <SharedWithAvatars permissions={shared} />
                                            </TableCell>
                                            <TableCell>
                                                {resource.shareRequests && resource.shareRequests.length > 0 && (
                                                    <PermissionRequest resource={resource} />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hidden sm:inline-flex"
                                                        data-testid={`share-${resource.name}`}
                                                        onClick={() =>
                                                            toggleOpen(resource._id, "shareDialogOpen", true)
                                                        }
                                                    >
                                                        <Share2Icon data-icon="inline-start" />
                                                        {t("share")}
                                                    </Button>
                                                    <DropdownMenu
                                                        open={!!state?.contextOpen}
                                                        onOpenChange={isOpen =>
                                                            toggleOpen(resource._id, "contextOpen", isOpen)
                                                        }
                                                    >
                                                        <DropdownMenuTrigger
                                                            aria-label={t("edit")}
                                                            render={<Button variant="ghost" size="icon-sm" />}
                                                        >
                                                            <EllipsisVerticalIcon />
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="sm:hidden"
                                                                onClick={() =>
                                                                    toggleOpen(resource._id, "shareDialogOpen", true)
                                                                }
                                                            >
                                                                <Share2Icon />
                                                                {t("share")}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                disabled={!hasShares}
                                                                onClick={() =>
                                                                    toggleOpen(resource._id, "editDialogOpen", true)
                                                                }
                                                            >
                                                                <PencilIcon />
                                                                {t("edit")}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                disabled={!hasShares}
                                                                onClick={() => setUnshareTarget(resource)}
                                                            >
                                                                <Unlink2Icon />
                                                                {t("unShare")}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                                <ShareTheResource
                                                    resource={resource}
                                                    permissions={shared}
                                                    open={state?.shareDialogOpen || false}
                                                    onClose={closeDialogs}
                                                />
                                                {state?.editDialogOpen && (
                                                    <EditTheResource
                                                        resource={resource}
                                                        permissions={shared}
                                                        onClose={closeDialogs}
                                                    />
                                                )}
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog
                open={unshareTarget !== undefined}
                onOpenChange={isOpen => {
                    if (!isOpen) {
                        setUnshareTarget(undefined);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("unShare")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("unShareAllConfirm")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (unshareTarget) {
                                    unshare.mutate(unshareTarget);
                                }
                                setUnshareTarget(undefined);
                            }}
                        >
                            {t("confirm")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
