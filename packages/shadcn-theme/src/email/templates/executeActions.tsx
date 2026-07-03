import i18n, { type TFunction } from "i18next";
import { Button, Raw, Text, render } from "jsx-email";
import type { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";
import { previewLocale } from "../constants";
import { EmailLayout } from "../layout";
import { isRtlLocale } from "../rtl";
import { defaultEmailTheme, ftlEmailTheme, type EmailTheme } from "../theme/theme";

type TemplateProps = Omit<GetTemplateProps, "plainText"> & { t: TFunction; theme: EmailTheme };

export const previewProps: TemplateProps = {
    t: i18n.getFixedT(previewLocale),
    locale: previewLocale,
    themeName: "vanilla",
    theme: defaultEmailTheme,
};

export const templateName = "ExecuteActions";

const { exp } = createVariablesHelper("executeActions.ftl");

export const Template = ({ locale, t, theme }: TemplateProps) => {
    const isRTL = isRtlLocale(locale);

    return (
        <EmailLayout preview={t("executeActions.subject")} locale={locale} theme={theme}>
            <Text>
                {t("executeActions.message", { realmName: exp("realmName") })}
                <Raw content="<#assign requiredActionsText><#if requiredActions??><#list requiredActions><#items as reqActionItem>${msg('requiredAction.${reqActionItem}')}<#sep>, </#sep></#items></#list></#if></#assign>" />
            </Text>

            <Text>{t("executeActions.clickLink")}</Text>

            <Button
                width={200}
                height={40}
                backgroundColor={theme.primaryColor}
                textColor={theme.buttonTextColor}
                align={isRTL ? "right" : "left"}
                borderRadius={3}
                href={exp("link")}
            >
                {t("executeActions.updateAccountButton")}
            </Button>

            <Text>
                {t("executeActions.linkExpiration", {
                    expiration: exp("linkExpirationFormatter(linkExpiration)"),
                })}
            </Text>

            <Text>{t("executeActions.ignoreMessage")}</Text>
        </EmailLayout>
    );
};

export const getTemplate: GetTemplate = async props => {
    const t = i18n.getFixedT(props.locale);
    return await render(<Template {...props} t={t} theme={ftlEmailTheme(exp)} />, {
        plainText: props.plainText,
    });
};

export const getSubject: GetSubject = async props => {
    const t = i18n.getFixedT(props.locale);
    return t("executeActions.subject");
};
