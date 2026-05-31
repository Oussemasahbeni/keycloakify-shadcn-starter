const SESSION_STORAGE_KEY = "kc-color-scheme";

export function getTheme(
    kcContextDarkMode: boolean | undefined
): "dark" | "light" | "system" {
    from_admin_policy: {
        if (kcContextDarkMode === undefined || kcContextDarkMode === true) {
            break from_admin_policy;
        }
        return "light";
    }

    from_url: {
        const url = new URL(window.location.href);

        const value = url.searchParams.get("dark");

        if (value === null) {
            break from_url;
        }

        {
            url.searchParams.delete("dark");
            window.history.replaceState({}, "", url.toString());
        }

        const isDark = value === "true";

        sessionStorage.setItem(SESSION_STORAGE_KEY, `${isDark}`);

        return isDark ? "dark" : "light";
    }

    from_session_storage: {
        const value = sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (value === null) {
            break from_session_storage;
        }

        return value === "true" ? "dark" : "light";
    }

    return "system";
}
