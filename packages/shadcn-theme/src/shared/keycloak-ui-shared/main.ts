/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/main.ts" --revert
 */

/*
 * Trimmed barrel: only the parts of keycloak-ui-shared the account console still uses.
 * The vendor tables, alerts, PatternFly form controls and selects were owned and deleted
 * (every page is written with shadcn); PatternFly is not a dependency anymore, so nothing
 * re-exported here may pull it back in.
 */

export { ErrorPage } from "./context/ErrorPage";
export { Help, useHelp } from "./context/HelpContext";
export { KeycloakProvider, useEnvironment, type KeycloakContext } from "./context/KeycloakContext";
export { getInjectedEnvironment, type BaseEnvironment } from "./context/environment";
export { FormErrorText, type FormErrorTextProps } from "./controls/FormErrorText";
export { HelpItem } from "./controls/HelpItem";
export { IconMapper } from "./icons/IconMapper";
export { UserProfileFields, mainPageContentId } from "./user-profile/UserProfileFields";
export {
    beerify,
    debeerify,
    isBundleKey,
    isUserProfileError,
    label,
    setUserProfileServerError,
} from "./user-profile/utils";
export type { UserFormFields } from "./user-profile/utils";
export { createNamedContext } from "./utils/createNamedContext";
export {
    getErrorDescription,
    getErrorMessage,
    getNetworkErrorMessage,
    getNetworkErrorDescription,
} from "./utils/errors";
export { isDefined } from "./utils/isDefined";
export { useRequiredContext } from "./utils/useRequiredContext";
export { useStoredState } from "./utils/useStoredState";
export { useSetTimeout } from "./utils/useSetTimeout";
export { generateId } from "./utils/generateId";
export { default as KeycloakMasthead } from "./masthead/Masthead";
export { useFetch } from "./utils/useFetch";
export { useErrorBoundary, ErrorBoundaryFallback, ErrorBoundaryProvider } from "./utils/ErrorBoundary";
export type { FallbackProps } from "./utils/ErrorBoundary";
