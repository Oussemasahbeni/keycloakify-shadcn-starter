import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { assert } from "tsafe/assert";
import { useKcContext } from "../../KcContext";
import { Template } from "../../components/Template";
import { useI18n } from "../../i18n";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "error.ftl");

    const { msg } = useI18n();

    return (
        <Template displayMessage={false} headerNode={msg("errorTitle")}>
            <div id="kc-error-message" className="space-y-4">
                <Alert variant="error">
                    <AlertDescription>
                        <span
                            className="instruction"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(kcContext.message.summary)
                            }}
                        />
                    </AlertDescription>
                </Alert>

                {!kcContext.skipLink && !!kcContext.client?.baseUrl && (
                    <div className="flex justify-end">
                        <Button type="button">
                            <a id="backToApplication" href={kcContext.client.baseUrl}>
                                {msg("backToApplication")}
                            </a>
                        </Button>
                    </div>
                )}
            </div>
        </Template>
    );
}
