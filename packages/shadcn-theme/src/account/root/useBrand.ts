import { useHref } from "react-router-dom";

import { resolveAssetUrl } from "#/lib/resolveAssetUrl";

import { useEnvironment } from "../../shared/keycloak-ui-shared";
import logoSvgUrl from "../assets/logo.svg";
import { getKcContext } from "../KcContext";

/**
 * Brand link + logos for the account console. Same configuration as the login
 * theme (`SHADCN_THEME_LOGO_URL` / `SHADCN_THEME_LOGO_DARK_URL`), with the stock
 * Keycloak logo as fallback.
 */
export function useBrand() {
    const { environment } = useEnvironment();
    const { kcContext } = getKcContext();

    const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
    const internalHref = useHref(logoUrl);

    // A URL starting with "/" is internal to the console; anything else is external.
    const href = logoUrl.startsWith("/") ? internalHref : logoUrl;

    const logo = resolveAssetUrl(kcContext.properties.SHADCN_THEME_LOGO_URL) || logoSvgUrl;
    const logoDark = resolveAssetUrl(kcContext.properties.SHADCN_THEME_LOGO_DARK_URL) || logo;

    return { href, logo, logoDark };
}
