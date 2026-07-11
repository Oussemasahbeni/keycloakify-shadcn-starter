import i18n, { type TFunction } from "i18next";
import { Button, Text, render } from "jsx-email";
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

export const templateName = "Email Update Confirmation";

const { exp } = createVariablesHelper("email-update-confirmation.ftl");

export const Template = ({ locale, t, theme }: TemplateProps) => {
    const isRTL = isRtlLocale(locale);

    return (
        <EmailLayout preview={t("email-update-confirmation.subject")} locale={locale} theme={theme}>
            <Text>
                {t("email-update-confirmation.updateEmailAddress", {
                    realmName: exp("realmName"),
                    newEmail: exp("newEmail"),
                })}
            </Text>

            <Text>{t("email-update-confirmation.clickLinkBelow")}</Text>

            <Button
                width={200}
                height={40}
                backgroundColor={theme.primaryColor}
                textColor={theme.foregroundColor}
                borderRadius={3}
                align={isRTL ? "right" : "left"}
                href={exp("link")}
            >
                {t("email-update-confirmation.updateEmail")}
            </Button>
            <Text>
                {t("email-update-confirmation.linkExpiration", {
                    expiration: exp("linkExpirationFormatter(linkExpiration)"),
                })}
            </Text>
            <Text>{t("email-update-confirmation.ignoreMessage")}</Text>
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
    return t("email-update-confirmation.subject");
};
