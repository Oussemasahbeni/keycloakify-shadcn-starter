import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-idp-link-email.ftl");

    const { msg } = useI18n();

    return (
        <Template headerNode={msg("emailLinkIdpTitle", kcContext.idpAlias)}>
            <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                    {msg(
                        "emailLinkIdp1",
                        kcContext.idpAlias,
                        kcContext.brokerContext.username,
                        kcContext.realm.displayName
                    )}
                </p>
                <p className="leading-relaxed">
                    {msg("emailLinkIdp2")}{" "}
                    <a
                        href={kcContext.url.loginAction}
                        className="inline-flex items-center gap-1 text-primary dark:text-white underline underline-offset-2"
                    >
                        {msg("doClickHere")}
                    </a>{" "}
                    {msg("emailLinkIdp3")}
                </p>

                <p className="leading-relaxed">
                    {msg("emailLinkIdp4")}{" "}
                    <a
                        href={kcContext.url.loginAction}
                        className="inline-flex items-center gap-1 text-primary dark:text-white underline underline-offset-2"
                    >
                        {msg("doClickHere")}
                    </a>{" "}
                    {msg("emailLinkIdp5")}
                </p>
            </div>
        </Template>
    );
}
