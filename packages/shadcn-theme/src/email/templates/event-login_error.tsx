import i18n, { type TFunction } from "i18next";
import { Text, render } from "jsx-email";
import type { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";

import { previewLocale } from "../constants";
import { EmailLayout } from "../layout";
import { defaultEmailTheme, ftlEmailTheme, type EmailTheme } from "../theme/theme";

type TemplateProps = Omit<GetTemplateProps, "plainText"> & { t: TFunction; theme: EmailTheme };

export const previewProps: TemplateProps = {
    t: i18n.getFixedT(previewLocale),
    locale: previewLocale,
    themeName: "vanilla",
    theme: defaultEmailTheme,
};

export const templateName = "Login Error";

const { exp } = createVariablesHelper("event-login_error.ftl");

export const Template = ({ locale, t, theme }: TemplateProps) => {
    return (
        <EmailLayout preview={t("event-login_error.subject")} locale={locale} theme={theme}>
            <Text>
                {t("event-login_error.message", {
                    date: exp("event.date"),
                    ipAddress: exp("event.ipAddress"),
                })}
            </Text>

            <Text>{t("event-login_error.contactAdmin")}</Text>
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
    return t("event-login_error.subject");
};
