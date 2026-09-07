{
    const isDark = (() => {
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

        element.innerHTML = `:root { color-scheme: ${isDark ? "dark" : "light"}; }`;

        document.head.appendChild(element);
    }

    if (isDark) {
        document.documentElement.classList.add("dark");
    }

    document.documentElement.style.backgroundColor = isDark ? "#0A0A0A" : "#FFFFFF";
}
