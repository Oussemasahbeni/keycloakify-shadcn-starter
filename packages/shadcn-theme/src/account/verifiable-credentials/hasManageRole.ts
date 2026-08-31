import type { useEnvironment } from "../../shared/keycloak-ui-shared";

type Context = ReturnType<typeof useEnvironment>;

/** Revoking credentials needs `manage-account` or `manage-verifiable-credentials` on the account client. */
export const hasManageRole = (context: Context) => {
    const roles: string[] = context.keycloak.tokenParsed?.resource_access?.["account"]?.roles ?? [];
    return roles.includes("manage-account") || roles.includes("manage-verifiable-credentials");
};
