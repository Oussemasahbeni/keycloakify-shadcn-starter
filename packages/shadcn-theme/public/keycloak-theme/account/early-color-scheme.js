/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/early-color-scheme.js" --public --revert
 *
 * early-color-scheme.js is a special file that will be imported in the head automatically by Keycloakify.
 * Note that this file is not loaded in Storybook or when using the Vite DEV server.
 * To test it you can use `NO_DEV_SERVER=true npx keycloakify start-keycloak` (NO_DEV_SERVER is only relevant for Account SPA and Admin themes)
 *
 * Runs in <head> before the account console bundle loads so the first paint already
 * uses the right color scheme (no white flash in dark mode). It mirrors the login
 * theme's `public/early-color-scheme.js`: the `dark` class and the `isDarkMode`
 * localStorage key are what `ThemeProvider` reads once React mounts, so the two
 * must stay in sync.
 */

{
    const isDark = (() => {
        admin_policy: {
            // Admin Console -> Realm Settings -> Themes -> Dark Mode = off
            if (typeof kcContext === "undefined" || kcContext.darkMode !== false) {
                break admin_policy;
            }

            return false;
        }

        query_param: {
            const value = new URLSearchParams(location.search).get("dark");

            switch (value) {
                case "true":
                    return true;
                case "false":
                    return false;
                default:
                    break query_param;
            }
        }

        local_storage: {
            const value = localStorage.getItem("isDarkMode");

            if (value === null) {
                break local_storage;
            }

            switch (value) {
                case "dark":
                    return true;
                case "light":
                    return false;
                default:
                    break local_storage;
            }
        }

        return matchMedia("(prefers-color-scheme: dark)").matches;
    })();

    {
        const element = document.createElement("style");

        element.textContent = `:root { color-scheme: ${isDark ? "dark" : "light"}; }`;

        document.head.appendChild(element);
    }

    if (isDark) {
        document.documentElement.classList.add("dark");
    }

    document.documentElement.style.backgroundColor = isDark ? "#0A0A0A" : "#FFFFFF";
}
