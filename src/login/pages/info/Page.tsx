import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";
import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "info.ftl");

    const { advancedMsgStr, msg } = useI18n();

    return (
        <Template
            displayMessage={false}
            headerNode={
                <span
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(
                            kcContext.messageHeader
                                ? advancedMsgStr(kcContext.messageHeader)
                                : kcContext.message.summary
                        )
                    }}
                />
            }
        >
            <Alert variant="info">
                <AlertDescription>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(
                                (() => {
                                    let html = kcContext.message.summary;

                                    if (kcContext.requiredActions) {
                                        html += "<b>";

                                        html += kcContext.requiredActions
                                            .map(requiredAction =>
                                                advancedMsgStr(
                                                    `requiredAction.${requiredAction}`
                                                )
                                            )
                                            .join(", ");

                                        html += "</b>";
                                    }

                                    return html;
                                })()
                            )
                        }}
                    />
                </AlertDescription>
            </Alert>

            {(() => {
                if (kcContext.skipLink) {
                    return null;
                }

                if (kcContext.pageRedirectUri) {
                    return (
                        <Button type="button" className="flex ms-auto">
                            <a href={kcContext.pageRedirectUri}>
                                {msg("backToApplication")}
                            </a>
                        </Button>
                    );
                }
                if (kcContext.actionUri) {
                    return (
                        <Button type="button" className="flex ms-auto">
                            <a href={kcContext.actionUri}>{msg("proceedWithAction")}</a>
                        </Button>
                    );
                }

                if (kcContext.client.baseUrl) {
                    return (
                        <Button type="button" className="flex ms-auto">
                            <a href={kcContext.client.baseUrl}>
                                {msg("backToApplication")}
                            </a>
                        </Button>
                    );
                }
            })()}
        </Template>
    );
}
