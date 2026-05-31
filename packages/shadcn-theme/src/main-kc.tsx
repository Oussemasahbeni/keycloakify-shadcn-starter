import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KcPage } from "./kc.gen";

if (!window.kcContext) {
    throw new Error("No Keycloak context");
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <KcPage kcContext={window.kcContext} />
    </StrictMode>
);
