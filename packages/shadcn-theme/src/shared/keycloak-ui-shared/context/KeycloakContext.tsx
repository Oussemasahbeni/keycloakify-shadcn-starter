/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/context/KeycloakContext.tsx" --revert
 */

import { Keycloak } from "oidc-spa/keycloak-js";
import { type PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { Spinner } from "#/components/ui/spinner";

import type { BaseEnvironment } from "./environment";
import { ErrorPage } from "./ErrorPage";
import { Help } from "./HelpContext";

export type KeycloakContext<T extends BaseEnvironment = BaseEnvironment> = KeycloakContextProps<T> & {
    keycloak: Keycloak;
};

const KeycloakEnvContext = createContext<KeycloakContext | undefined>(undefined);

// eslint-disable-next-line react/only-export-components -- context hook lives with its provider
export const useEnvironment = <T extends BaseEnvironment = BaseEnvironment>() => {
    const context = useContext(KeycloakEnvContext);
    if (!context) {
        throw Error("no environment provider in the hierarchy make sure to add the provider");
    }
    return context as KeycloakContext<T>;
};

interface KeycloakContextProps<T extends BaseEnvironment> {
    environment: T;
    keycloak?: Keycloak;
}

/**
 * Initialises the Keycloak client (unless one is injected) and provides the environment.
 * Alerts are shadcn toasts now, so the PatternFly `AlertProvider` is gone.
 */
export const KeycloakProvider = <T extends BaseEnvironment>({
    environment,
    keycloak: externalKeycloak,
    children,
}: PropsWithChildren<KeycloakContextProps<T>>) => {
    const calledOnce = useRef(false);
    const [init, setInit] = useState(!!externalKeycloak);
    const [error, setError] = useState<unknown>();
    const keycloak = useMemo(
        () =>
            externalKeycloak ??
            new Keycloak({
                url: environment.serverBaseUrl,
                realm: environment.realm,
                clientId: environment.clientId,
            }),
        [environment, externalKeycloak],
    );

    useEffect(() => {
        // Skip initialization if using external keycloak (already initialized).
        if (externalKeycloak) {
            return;
        }
        // Only needed in dev mode (StrictMode double effects).
        if (calledOnce.current) {
            return;
        }
        keycloak
            .init({ onLoad: "login-required", pkceMethod: "S256", scope: environment.scope })
            .then(() => setInit(true))
            .catch((initError: unknown) => setError(initError));
        calledOnce.current = true;
    }, [keycloak, externalKeycloak, environment.scope]);

    if (error) {
        return <ErrorPage error={error} />;
    }

    if (!init) {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <Spinner className="size-6" />
            </div>
        );
    }

    return (
        <KeycloakEnvContext.Provider value={{ environment, keycloak }}>
            <Help>{children}</Help>
        </KeycloakEnvContext.Provider>
    );
};
