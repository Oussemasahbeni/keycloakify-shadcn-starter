/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/verifiable-credentials/CredentialRow.tsx" --revert
 */

import { EllipsisVerticalIcon, ListIcon, TableOfContentsIcon, Trash2Icon, WalletIcon } from "lucide-react";
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
import { Button } from "#/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { TableCell, TableRow } from "#/components/ui/table";
import { toast } from "#/components/ui/toast";

import type { AccountEnvironment } from "..";
import { useEnvironment } from "../../shared/keycloak-ui-shared";
import { deleteVerifiableCredential } from "../api/methods";
import { accountKeys, useAccountAction } from "../api/queries";
import type { UserVerifiableCredentialRepresentation } from "../api/representations";
import { FORMAT_DATE_ONLY, formatDate } from "../utils/formatDate";
import { toastApiError } from "../utils/toastError";
import { hasManageRole } from "./hasManageRole";
import { IssuedCredentialsModal } from "./IssuedCredentialsModal";
import { UserAttributesDialog } from "./UserAttributesDialog";

type CredentialRowProps = {
    credential: UserVerifiableCredentialRepresentation;
};

export const CredentialRow = ({ credential }: CredentialRowProps) => {
    const { t } = useTranslation();
    const context = useEnvironment<AccountEnvironment>();
    const [showAttributes, setShowAttributes] = useState(false);
    const [showIssued, setShowIssued] = useState(false);
    const [showRevoke, setShowRevoke] = useState(false);

    const name = credential.credentialScopeName ?? "";
    const userAttributes = credential.userAttributes ?? {};
    const hasUserAttributes = Object.keys(userAttributes).length > 0;
    const canManage = hasManageRole(context);
    const date = (value?: number) =>
        value ? formatDate(new Date(value), context.environment.locale, FORMAT_DATE_ONLY) : "—";

    const revoke = useAccountAction(api => deleteVerifiableCredential(api, name), {
        invalidates: [accountKeys.verifiableCredentials(), accountKeys.issuedVerifiableCredentials()],
        onSuccess: () => toast.add({ title: t("credentialDeletedSuccess"), type: "success" }),
        onError: error => toastApiError(t, "credentialDeleteError", error),
    });

    /** Starts Keycloak's "verifiable_credential_offer" application-initiated action. */
    const issueToWallet = async () => {
        try {
            const config = {
                credentialConfigurationId: credential.credentialConfigurationId,
                preAuthorized: false,
            };
            await context.keycloak.login({
                action: `verifiable_credential_offer:${btoa(JSON.stringify(config))}`,
            });
        } catch (error) {
            toastApiError(t, "credentialIssuanceError", error);
        }
    };

    return (
        <TableRow id={`credential-${name}`}>
            <TableCell className="font-medium">
                <div className="flex flex-col">
                    <span>{name}</span>
                    {credential.credentialConfigurationId && (
                        <span className="text-xs font-normal text-muted-foreground">
                            {credential.credentialConfigurationId}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell>{date(credential.createdDate)}</TableCell>
            <TableCell>{date(credential.updatedDate)}</TableCell>
            <TableCell>
                <div className="flex items-center justify-end gap-1">
                    <Button
                        id={`credential-${name}-issue`}
                        variant="outline"
                        size="sm"
                        onClick={() => void issueToWallet()}
                    >
                        <WalletIcon data-icon="inline-start" />
                        {t("issueToWallet")}
                    </Button>
                    <Button
                        id={`credential-${name}-view-issued`}
                        variant="ghost"
                        size="sm"
                        className="hidden md:inline-flex"
                        onClick={() => setShowIssued(true)}
                    >
                        <ListIcon data-icon="inline-start" />
                        {t("viewIssuedCredentials")}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            aria-label={t("actions", { defaultValue: "Actions" })}
                            render={<Button variant="ghost" size="icon-sm" />}
                        >
                            <EllipsisVerticalIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="md:hidden" onClick={() => setShowIssued(true)}>
                                <ListIcon />
                                {t("viewIssuedCredentials")}
                            </DropdownMenuItem>
                            {hasUserAttributes && (
                                <DropdownMenuItem onClick={() => setShowAttributes(true)}>
                                    <TableOfContentsIcon />
                                    {t("credentialUserAttributes")}
                                </DropdownMenuItem>
                            )}
                            {canManage && (
                                <DropdownMenuItem variant="destructive" onClick={() => setShowRevoke(true)}>
                                    <Trash2Icon />
                                    {t("doRevoke")}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <AlertDialog open={showRevoke} onOpenChange={setShowRevoke}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("revokeVerifiableCredentialTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t("deleteCredentialConfirm", { credentialName: name })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t("doCancel")}</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => revoke.mutate()}>
                                {t("doRevoke")}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {showAttributes && (
                    <UserAttributesDialog
                        credentialScopeName={name}
                        userAttributes={userAttributes}
                        onClose={() => setShowAttributes(false)}
                    />
                )}
                {showIssued && (
                    <IssuedCredentialsModal credentialScopeName={name} onClose={() => setShowIssued(false)} />
                )}
            </TableCell>
        </TableRow>
    );
};
