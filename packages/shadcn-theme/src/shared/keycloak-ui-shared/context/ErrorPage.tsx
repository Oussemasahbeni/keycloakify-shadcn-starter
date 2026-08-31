/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/context/ErrorPage.tsx" --revert
 */

import { CircleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "#/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "#/components/ui/card";

import { getNetworkErrorMessage } from "../utils/errors";

type ErrorPageProps = {
    error?: unknown;
};

function getErrorMessage(error: unknown): string | null {
    return error instanceof Error ? error.message : null;
}

function onRetry() {
    location.href = location.origin + location.pathname;
}

export const ErrorPage = (props: ErrorPageProps) => {
    const { t, i18n } = useTranslation();
    const error = props.error;
    const errorMessage = getErrorMessage(error);
    const networkErrorMessage = getNetworkErrorMessage(error);
    console.error(error);

    const description = errorMessage
        ? t(errorMessage)
        : networkErrorMessage && i18n.exists(networkErrorMessage)
          ? t(networkErrorMessage)
          : t("somethingWentWrongDescription");

    return (
        <div className="flex min-h-svh items-center justify-center bg-background p-4 text-foreground">
            <Card className="w-full max-w-md" role="alert">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <CircleAlertIcon className="size-5 shrink-0" />
                        {t("somethingWentWrong")}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button onClick={onRetry}>{t("tryAgain")}</Button>
                </CardFooter>
            </Card>
        </div>
    );
};
