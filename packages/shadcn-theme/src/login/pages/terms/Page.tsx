import { Button } from "#/components/ui/button";
import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "terms.ftl");

    const { msg, msgStr } = useI18n();

    const { url } = kcContext;

    return (
        <Template displayMessage={false} headerNode={msg("termsTitle")}>
            <div className="space-y-6">
                <div
                    id="kc-terms-text"
                    className="p-4 bg-muted/50 rounded-lg max-h-64 overflow-y-auto text-sm leading-relaxed"
                >
                    {msg("termsText")}
                </div>

                <form className="space-y-4" action={url.loginAction} method="POST">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                        <Button
                            variant="outline"
                            name="cancel"
                            id="kc-decline"
                            type="submit"
                            className="sm:flex-1"
                        >
                            {msgStr("doDecline")}
                        </Button>
                        <Button
                            name="accept"
                            id="kc-accept"
                            type="submit"
                            className="sm:flex-1"
                        >
                            {msgStr("doAccept")}
                        </Button>
                    </div>
                </form>
            </div>
        </Template>
    );
}
