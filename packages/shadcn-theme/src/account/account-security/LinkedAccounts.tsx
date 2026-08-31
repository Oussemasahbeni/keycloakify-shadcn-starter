/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/LinkedAccounts.tsx" --revert
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

import { type LinkedAccountQueryParams } from "../api/methods";
import { useLinkedAccounts } from "../api/queries";
import type { LinkedAccountRepresentation } from "../api/representations";
import { DataTableToolbar } from "../components/DataTableToolbar";
import { Page } from "../components/page/Page";
import { AccountRow } from "./AccountRow";

type AccountListProps = {
    id: string;
    title: string;
    emptyMessage: string;
    accounts: LinkedAccountRepresentation[];
    params: LinkedAccountQueryParams;
    onParamsChange: (params: LinkedAccountQueryParams) => void;
    isLinked: boolean;
};

function AccountList({ id, title, emptyMessage, accounts, params, onParamsChange, isLinked }: AccountListProps) {
    const { t } = useTranslation();
    // One extra row is requested to know whether a next page exists; never show it.
    const pageSize = params.max - 1;
    const visible = accounts.slice(0, pageSize);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <DataTableToolbar
                    onSearch={search => onParamsChange({ ...params, first: 0, search })}
                    searchPlaceholder={t("filterByName")}
                    first={params.first}
                    perPage={pageSize}
                    perPageOptions={[5, 10, 20]}
                    count={visible.length}
                    hasNext={accounts.length > pageSize}
                    onFirstChange={first => onParamsChange({ ...params, first })}
                    onPerPageChange={size => onParamsChange({ ...params, first: 0, max: size + 1 })}
                />
                <ul id={id} aria-label={title} className="flex flex-col divide-y divide-border">
                    {visible.length > 0 ? (
                        visible.map(account => (
                            <AccountRow key={account.providerName} account={account} isLinked={isLinked} />
                        ))
                    ) : (
                        <li className="py-3 text-sm text-muted-foreground">{emptyMessage}</li>
                    )}
                </ul>
            </CardContent>
        </Card>
    );
}

export const LinkedAccounts = () => {
    const { t } = useTranslation();
    const [paramsUnlinked, setParamsUnlinked] = useState<LinkedAccountQueryParams>({
        first: 0,
        max: 6,
        linked: false,
    });
    const [paramsLinked, setParamsLinked] = useState<LinkedAccountQueryParams>({ first: 0, max: 6, linked: true });
    const { data: linkedAccounts = [] } = useLinkedAccounts(paramsLinked);
    const { data: unlinkedAccounts = [] } = useLinkedAccounts(paramsUnlinked);

    return (
        <Page title={t("linkedAccounts")} description={t("linkedAccountsIntroMessage")}>
            <AccountList
                id="linked-idps"
                title={t("linkedLoginProviders")}
                emptyMessage={t("linkedEmpty")}
                accounts={linkedAccounts}
                params={paramsLinked}
                onParamsChange={setParamsLinked}
                isLinked
            />
            <AccountList
                id="unlinked-idps"
                title={t("unlinkedLoginProviders")}
                emptyMessage={t("unlinkedEmpty")}
                accounts={unlinkedAccounts}
                params={paramsUnlinked}
                onParamsChange={setParamsUnlinked}
                isLinked={false}
            />
        </Page>
    );
};

export default LinkedAccounts;
