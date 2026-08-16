import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-page-expired.ftl");

    const { msg } = useI18n();

    return (
        <Template headerNode={msg("pageExpiredTitle")}>
            <div className="flex flex-col gap-3 text-sm leading-relaxed">
                <p>
                    {msg("pageExpiredMsg1")}{" "}
                    <a
                        id="loginRestartLink"
                        href={kcContext.url.loginRestartFlowUrl}
                        className="text-primary dark:text-foreground hover:text-primary/80 font-medium underline underline-offset-2"
                    >
                        {msg("doClickHere")}
                    </a>
                    .
                </p>
                <p>
                    {msg("pageExpiredMsg2")}{" "}
                    <a
                        id="loginContinueLink"
                        href={kcContext.url.loginAction}
                        className="text-primary dark:text-foreground hover:text-primary/80 font-medium underline underline-offset-2"
                    >
                        {msg("doClickHere")}
                    </a>
                    .
                </p>
            </div>
        </Template>
    );
}
