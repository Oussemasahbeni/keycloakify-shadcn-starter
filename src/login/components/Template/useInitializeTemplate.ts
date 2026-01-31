import { useAuthChecker } from "@/login/components/Template/useAuthChecker";
import { useInsertScriptTags } from "@keycloakify/login-ui/tools/useInsertScriptTags";
import { useEffect } from "react";
import { useKcContext } from "../../KcContext";

export function useInitializeTemplate() {
    const { kcContext } = useKcContext();

    useAuthChecker(kcContext);

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
    }, [insertScriptTags]);

    return { isReadyToRender: true };
}
