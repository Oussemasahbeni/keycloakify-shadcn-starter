const SESSION_STORAGE_KEY = "redirectUrlOrigin";

export const redirectUrlOrigin = ((): string => {
    from_url: {
        const url = new URL(window.location.href);

        const value = url.searchParams.get("redirect_url");

        if (value === null) {
            break from_url;
        }

        const redirectUrlOrigin = new URL(value).origin;

        sessionStorage.setItem(SESSION_STORAGE_KEY, redirectUrlOrigin);

        return redirectUrlOrigin;
    }

    from_session_storage: {
        const redirectUrlOrigin = sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (redirectUrlOrigin === null) {
            break from_session_storage;
        }

        return redirectUrlOrigin;
    }

    return "#";
})();
