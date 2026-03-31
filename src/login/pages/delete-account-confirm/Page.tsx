import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "delete-account-confirm.ftl");
    const isRtl = kcContext.locale?.rtl ?? false;

    const { msg, msgStr } = useI18n();

    return (
        <Template headerNode={msg("deleteAccountConfirm")}>
            <form
                action={kcContext.url.loginAction}
                className="flex flex-col gap-4"
                method="post"
            >
                <Alert variant="warning">
                    <AlertDescription>
                        <span>{msg("irreversibleAction")}</span>
                    </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-4">
                    <p className="text-foreground">{msg("deletingImplies")}</p>

                    <ul className="list-inside list-disc ps-4 text-muted-foreground">
                        <li>{msg("loggingOutImmediately")}</li>
                        <li>{msg("errasingData")}</li>
                    </ul>

                    <p className="text-foreground font-medium">
                        {msg("finalDeletionConfirmation")}
                    </p>
                </div>

                <div
                    className={[
                        "flex flex-col gap-3 sm:flex-row",
                        isRtl ? "sm:flex-row-reverse" : ""
                    ].join(" ")}
                >
                    {kcContext.triggered_from_aia && (
                        <Button
                            variant="outline"
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            className="sm:flex-1"
                        >
                            {msgStr("doCancel")}
                        </Button>
                    )}

                    <Button
                        type="submit"
                        variant="destructive"
                        className="sm:flex-1 text-white"
                    >
                        {msgStr("doConfirmDelete")}
                    </Button>
                </div>
            </form>
        </Template>
    );
}
