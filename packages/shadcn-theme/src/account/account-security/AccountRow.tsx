/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/AccountRow.tsx" --revert
 */

import { Link2Icon, Unlink2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { toast } from "#/components/ui/toast";

import { IconMapper, label, useEnvironment } from "../../shared/keycloak-ui-shared";
import { unLinkAccount } from "../api/methods";
import { accountKeys, useAccountAction } from "../api/queries";
import type { LinkedAccountRepresentation } from "../api/representations";
import { toastApiError } from "../utils/toastError";

type AccountRowProps = {
    account: LinkedAccountRepresentation;
    isLinked?: boolean;
};

export const AccountRow = ({ account, isLinked = false }: AccountRowProps) => {
    const { t } = useTranslation();
    const context = useEnvironment();
    const { login } = context.keycloak;

    const unLink = useAccountAction(api => unLinkAccount(api, account), {
        invalidates: [accountKeys.linkedAccounts()],
        onSuccess: () => toast.add({ title: t("unLinkSuccess"), type: "success" }),
        onError: error => toastApiError(t, "unLinkError", error),
    });

    return (
        <li
            id={`${account.providerAlias}-idp`}
            data-testid={`linked-accounts/${account.providerName}`}
            className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:gap-4"
        >
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted [&_svg]:size-5">
                    <IconMapper icon={account.providerName} />
                </span>
                <div className="flex min-w-0 flex-col">
                    <span id={`${account.providerAlias}-idp-name`} className="truncate text-sm font-medium">
                        {label(t, account.displayName)}
                    </span>
                    {account.linkedUsername && (
                        <span
                            id={`${account.providerAlias}-idp-username`}
                            className="truncate text-xs text-muted-foreground"
                        >
                            {account.linkedUsername}
                        </span>
                    )}
                </div>
            </div>
            <Badge id={`${account.providerAlias}-idp-label`} variant="outline">
                {t(account.social ? "socialLogin" : "systemDefined")}
            </Badge>
            {isLinked ? (
                <Button
                    id={`${account.providerAlias}-idp-unlink`}
                    variant="outline"
                    size="sm"
                    disabled={unLink.isPending}
                    onClick={() => unLink.mutate()}
                >
                    <Unlink2Icon data-icon="inline-start" />
                    {t("unLink")}
                </Button>
            ) : (
                <Button
                    id={`${account.providerAlias}-idp-link`}
                    variant="outline"
                    size="sm"
                    onClick={() => login({ action: `idp_link:${account.providerAlias}` })}
                >
                    <Link2Icon data-icon="inline-start" />
                    {t("link")}
                </Button>
            )}
        </li>
    );
};
