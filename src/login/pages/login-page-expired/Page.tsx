import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-page-expired.ftl");

    const { msg } = useI18n();

    return (
        <Template headerNode={msg("pageExpiredTitle")}>
            <div className="space-y-3 text-sm leading-relaxed">
                <p>
                    {msg("pageExpiredMsg1")}{" "}
                    <a
                        id="loginRestartLink"
                        href={kcContext.url.loginRestartFlowUrl}
                        className="text-primary dark:text-white hover:text-primary/80 underline underline-offset-2 font-medium"
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
                        className="text-primary dark:text-white hover:text-primary/80 underline underline-offset-2 font-medium"
                    >
                        {msg("doClickHere")}
                    </a>
                    .
                </p>
            </div>
        </Template >
    );
}
