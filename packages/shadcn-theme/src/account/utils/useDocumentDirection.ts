import { useSyncExternalStore } from "react";

type Direction = "ltr" | "rtl";

function getDirection(): Direction {
    const direction = document.documentElement.dir || getComputedStyle(document.documentElement).direction;

    return direction === "rtl" ? "rtl" : "ltr";
}

function subscribe(onChange: () => void) {
    const observer = new MutationObserver(onChange);

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });

    return () => observer.disconnect();
}

/** Current text direction of the document (`<html dir>`), updated when the attribute changes. */
export function useDocumentDirection(): Direction {
    return useSyncExternalStore(subscribe, getDirection, () => "ltr");
}
