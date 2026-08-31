/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Root.tsx" --revert
 */

import { Suspense, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createBrowserRouter, Navigate, Outlet, type RouteObject, RouterProvider } from "react-router-dom";

import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { Spinner } from "#/components/ui/spinner";
import { toast } from "#/components/ui/toast";

import { type AccountEnvironment } from "..";
import { ErrorPage, type KeycloakContext, useEnvironment } from "../../shared/keycloak-ui-shared";
import { useContent } from "../api/queries";
import { routes } from "../routes";
import { Header } from "./Header";
import { type MenuItem, PageNav } from "./PageNav";

/** Scroll container the shared `ScrollForm` listens to for jump-link highlighting. */
export const MAIN_CONTENT_ID = "kc-main-content-page-container";

function mapRoutes(context: KeycloakContext<AccountEnvironment>, content: MenuItem[]): RouteObject[] {
    return content
        .map(item => {
            if ("children" in item) {
                return mapRoutes(context, item.children);
            }

            // Do not add route disabled via feature flags
            if (item.isVisible && !context.environment.features[item.isVisible]) {
                return null;
            }

            return {
                ...item,
                element: "path" in item ? routes.find(r => r.path === (item.id ?? item.path))?.element : undefined,
            };
        })
        .filter(item => !!item)
        .flat();
}

function CatchAllRedirect() {
    const { t } = useTranslation();

    useEffect(() => {
        toast.add({ title: t("pageNotFound"), type: "warning" });
    }, [t]);

    return <Navigate to="." replace />;
}

function PageSpinner() {
    return (
        <div className="flex flex-1 items-center justify-center p-8">
            <Spinner className="size-6" />
        </div>
    );
}

function Layout() {
    return (
        <SidebarProvider>
            <PageNav />
            <SidebarInset className="h-svh overflow-hidden">
                <Header />
                <div id={MAIN_CONTENT_ID} className="flex flex-1 flex-col overflow-y-auto">
                    <Suspense fallback={<PageSpinner />}>
                        <Outlet />
                    </Suspense>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export const Root = () => {
    const context = useEnvironment<AccountEnvironment>();
    const { data: menu } = useContent();

    const content = useMemo<RouteObject[] | undefined>(
        () =>
            menu && [
                {
                    path: decodeURIComponent(new URL(context.environment.baseUrl).pathname),
                    element: <Layout />,
                    errorElement: <ErrorPage />,
                    children: [...mapRoutes(context, menu), { path: "*", element: <CatchAllRedirect /> }],
                },
            ],
        [menu, context],
    );

    if (!content) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <Spinner className="size-6" />
            </div>
        );
    }

    return <RouterProvider router={createBrowserRouter(content)} />;
};
