import { useInsertScriptTags } from "@keycloakify/login-ui/tools/useInsertScriptTags";
import { useEffect } from "react";
import { useKcContext } from "../../KcContext";
import { useAuthChecker } from "./useAuthChecker";

export function useInitializeTemplate() {
    const { kcContext } = useKcContext();

    useAuthChecker();

    const { insertScriptTags } = useInsertScriptTags({
        effectId: "Template",
        scriptTags: [
            ...(kcContext.scripts === undefined
                ? []
                : kcContext.scripts.map(src => ({
                      type: "text/javascript" as const,
                      src
                  })))
        ]
    });

    useEffect(() => {
        insertScriptTags();
    }, []);
}
