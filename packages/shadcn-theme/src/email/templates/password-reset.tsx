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

export const templateName = "Password Reset";

const { exp } = createVariablesHelper("password-reset.ftl");

export const Template = ({ locale, t, theme }: TemplateProps) => {
    const isRTL = isRtlLocale(locale);

    return (
        <EmailLayout preview={t("password-reset.subject")} locale={locale} theme={theme}>
            <Text>{t("password-reset.message", { realmName: exp("realmName") })}</Text>
            <Text>
                <Button
                    width={200}
                    align={isRTL ? "right" : "left"}
                    height={40}
                    backgroundColor={theme.primaryColor}
                    textColor={theme.foregroundColor}
                    borderRadius={3}
                    href={exp("link")}
                >
                    {t("password-reset.resetButton")}
                </Button>
            </Text>
            <Text>
                {t("password-reset.linkExpiration", {
                    expiration: exp("linkExpirationFormatter(linkExpiration)"),
                })}
            </Text>
            <Text>{t("password-reset.ignoreMessage")}</Text>
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
    return t("password-reset.subject");
};
