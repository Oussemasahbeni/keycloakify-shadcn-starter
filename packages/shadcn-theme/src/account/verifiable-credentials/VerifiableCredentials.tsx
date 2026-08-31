/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/verifiable-credentials/VerifiableCredentials.tsx" --revert
 */

import { BadgeCheckIcon, RefreshCwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "#/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "#/components/ui/empty";
import { Spinner } from "#/components/ui/spinner";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "#/components/ui/table";

import { useVerifiableCredentials } from "../api/queries";
import { Page } from "../components/page/Page";
import { CredentialRow } from "./CredentialRow";

export const VerifiableCredentials = () => {
    const { t } = useTranslation();
    const { data: credentials, refetch } = useVerifiableCredentials();

    return (
        <Page
            title={t("verifiableCredentials")}
            description={t("verifiableCredentialsDescription")}
            actions={
                <Button variant="outline" size="sm" onClick={() => void refetch()}>
                    <RefreshCwIcon data-icon="inline-start" />
                    {t("refresh")}
                </Button>
            }
        >
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold tracking-tight">{t("myVerifiableCredentials")}</h2>

                {!credentials ? (
                    <div className="flex justify-center p-8">
                        <Spinner className="size-6" />
                    </div>
                ) : credentials.length === 0 ? (
                    <Empty className="rounded-(--radius) border border-dashed border-border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <BadgeCheckIcon />
                            </EmptyMedia>
                            <EmptyTitle>{t("noVerifiableCredentials")}</EmptyTitle>
                            <EmptyDescription>{t("verifiableCredentialsDescription")}</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="rounded-(--radius) border border-border bg-card text-card-foreground">
                        <Table id="verifiable-credentials" aria-label={t("verifiableCredentials")}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("credentialScopeName")}</TableHead>
                                    <TableHead>{t("credentialCreatedDate")}</TableHead>
                                    <TableHead>{t("credentialUpdatedDate")}</TableHead>
                                    <TableHead className="w-px">
                                        <span className="sr-only">{t("actions", { defaultValue: "Actions" })}</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {credentials.map(credential => (
                                    <CredentialRow key={credential.credentialScopeName} credential={credential} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </section>
        </Page>
    );
};

export default VerifiableCredentials;
