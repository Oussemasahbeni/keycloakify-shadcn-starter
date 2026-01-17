import type { KcContext } from "@/login/KcContext";
import { useEffect, useRef } from "react";

const SESSION_POLLING_INTERVAL = 2000;
const AUTH_SESSION_TIMEOUT_MILLISECS = 1000;

function getCookieByName(name: string) {
    for (const cookie of document.cookie.split(";")) {
        const [key, value] = cookie.split("=").map(value => value.trim());
        if (key === name) {
            return value.startsWith('"') && value.endsWith('"')
                ? value.slice(1, -1)
                : value;
        }
    }
    return null;
}

function getKcAuthSessionHash() {
    return getCookieByName("KC_AUTH_SESSION_HASH");
}

function getSession() {
    return getCookieByName("KEYCLOAK_SESSION");
}

/**
 * 1. Check Auth Session Validity
 *
 * Checks if the current tab's authentication session ID matches the one stored in the browser cookie.
 *
 * If the user opens the login page in Tab A, then opens it again in Tab B, the server might generate
 * a new session ID. Tab A is now "stale". If the user tries to log in on Tab A, it would fail.
 * This hook detects that mismatch and refreshes the page to get the new ID.
 */
function useCheckAuthSessionValidity(
    authenticationSession: KcContext["authenticationSession"]
) {
    useEffect(() => {
        const pageAuthSessionHash = authenticationSession?.authSessionIdHash;
        if (!pageAuthSessionHash) return;

        const timer = setTimeout(() => {
            const cookieAuthSessionHash = getKcAuthSessionHash();
            // If the cookie exists, but doesn't match the ID in our current HTML/Context
            if (cookieAuthSessionHash && cookieAuthSessionHash !== pageAuthSessionHash) {
                location.reload();
            }
        }, AUTH_SESSION_TIMEOUT_MILLISECS);

        return () => clearTimeout(timer);
    }, [authenticationSession]);
}

/**
 * 2. Auto-Login Polling
 *
 * Polls for a valid KEYCLOAK_SESSION cookie every few seconds.
 *
 * If the user leaves this tab open and logs into the app via a different tab (SSO),
 * this hook detects the new session and automatically redirects this tab to the success URL.
 */
function useAutoLoginPolling(redirectUrl: string | undefined) {
    const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!redirectUrl) return;

        // If we already have a session upon loading, do nothing
        const initialSession = getSession();
        if (initialSession) return;

        const poll = () => {
            const session = getSession();

            if (!session) {
                // No session yet, check again in 2 seconds
                pollingTimeoutRef.current = setTimeout(poll, SESSION_POLLING_INTERVAL);
            } else {
                // Session found! Redirect to the app.
                location.href = redirectUrl;
            }
        };

        // Start the polling loop
        pollingTimeoutRef.current = setTimeout(poll, SESSION_POLLING_INTERVAL);

        // Cleanup: Stop the timer if the component unmounts
        return () => {
            if (pollingTimeoutRef.current) {
                clearTimeout(pollingTimeoutRef.current);
            }
        };
    }, [redirectUrl]);
}

export function useAuthChecker(kcContext: KcContext) {
    useCheckAuthSessionValidity(kcContext.authenticationSession);

    useAutoLoginPolling(kcContext.url.ssoLoginInOtherTabsUrl);
}
