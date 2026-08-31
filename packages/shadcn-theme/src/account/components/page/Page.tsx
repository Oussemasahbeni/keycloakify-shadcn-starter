/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/components/page/Page.tsx" --revert
 */

import type { PropsWithChildren, ReactNode } from "react";

type PageProps = {
    title: string;
    description: string;
    actions?: ReactNode;
};

export const Page = ({ title, description, actions, children }: PropsWithChildren<PageProps>) => {
    return (
        <div className="mx-auto flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 data-testid="page-heading" className="text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </header>
            <div className="flex flex-col gap-6">{children}</div>
        </div>
    );
};
