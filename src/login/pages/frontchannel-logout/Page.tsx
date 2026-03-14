import { Button } from "@/components/ui/button";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { useEffect, useState } from "react";
import { FiCheck, FiExternalLink } from "react-icons/fi";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "frontchannel-logout.ftl");

    const { msg, msgStr } = useI18n();
    const [iframeLoadCount, setIframeLoadCount] = useState(0);

    useEffect(() => {
        if (!kcContext.logout.logoutRedirectUri) {
            return;
        }

        if (iframeLoadCount !== kcContext.logout.clients.length) {
            return;
        }

        window.location.replace(kcContext.logout.logoutRedirectUri);
    }, [iframeLoadCount]);

    return (
        <Template
            documentTitle={msgStr("frontchannel-logout.title")}
            headerNode={msg("frontchannel-logout.title")}
        >
            <p>{msg("frontchannel-logout.message")}</p>

            {kcContext.logout.clients.length > 0 && (
                <div className="space-y-3">
                    <div className="space-y-2">
                        {kcContext.logout.clients.map((client, index) => (
                            <div
                                key={client.name || index}
                                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                            >
                                <FiCheck className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">
                                    {client.name || `Application ${index + 1}`}
                                </span>
                                <iframe
                                    src={client.frontChannelLogoutUrl}
                                    style={{ display: "none" }}
                                    title={`Logout frame for ${client.name}`}
                                    onLoad={() => {
                                        setIframeLoadCount(count => count + 1);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {kcContext.logout.logoutRedirectUri && (
                <div className="flex justify-center">
                    <Button asChild size="lg">
                        <a
                            id="continue"
                            href={kcContext.logout.logoutRedirectUri}
                            className="flex items-center gap-2"
                        >
                            {msg("doContinue")}
                            <FiExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            )}
        </Template>
    );
}
