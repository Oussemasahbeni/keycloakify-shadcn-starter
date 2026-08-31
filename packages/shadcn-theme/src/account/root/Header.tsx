/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Header.tsx" --revert
 */

import { SquareArrowOutUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";

import type { AccountEnvironment } from "..";
import { KeycloakMasthead, label, useEnvironment } from "../../shared/keycloak-ui-shared";
import { Brand } from "./Brand";
import { useBrand } from "./useBrand";

const ReferrerLink = () => {
    const { environment } = useEnvironment<AccountEnvironment>();
    const { t } = useTranslation();

    return environment.referrerUrl ? (
        <a
            data-testid="referrer-link"
            className={cn(buttonVariants({ variant: "link" }), "hidden sm:inline-flex")}
            href={environment.referrerUrl.replace("_hash_", "#")}
        >
            {t("backTo", {
                app: label(t, environment.referrerName, environment.referrerUrl),
            })}
            <SquareArrowOutUpRight data-icon="inline-end" />
        </a>
    ) : null;
};

export const Header = () => {
    const { keycloak } = useEnvironment();
    const { t } = useTranslation();
    const { href } = useBrand();

    return (
        <KeycloakMasthead
            data-testid="page-header"
            keycloak={keycloak}
            features={{ hasManageAccount: false }}
            // On desktop the logo lives in the sidebar header; show it here only when the sidebar is off-canvas.
            brand={{ href, logo: <Brand alt={t("logo")} />, className: "md:hidden" }}
            toolbarItems={[<ReferrerLink key="link" />]}
        />
    );
};
