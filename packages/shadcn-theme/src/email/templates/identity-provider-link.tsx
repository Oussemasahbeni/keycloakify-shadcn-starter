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

export const templateName = "Identity Provider Link";

const { exp } = createVariablesHelper("identity-provider-link.ftl");

export const Template = ({ locale, t, theme }: TemplateProps) => {
    const isRTL = isRtlLocale(locale);

    return (
        <EmailLayout preview={t("identity-provider-link.subject")} locale={locale} theme={theme}>
            <Text>
                {t("identity-provider-link.message", {
                    identityProviderDisplayName: exp("identityProviderDisplayName"),
                    realmName: exp("realmName"),
                    username: exp("identityProviderContext.username"),
                })}
            </Text>

            <Text>{t("identity-provider-link.clickLink")}</Text>

            <Button
                width={200}
                align={isRTL ? "right" : "left"}
                height={40}
                backgroundColor={theme.primaryColor}
                textColor={theme.buttonTextColor}
                borderRadius={3}
                href={exp("link")}
            >
                {t("identity-provider-link.linkAccountsButton")}
            </Button>
            <Text>
                {t("identity-provider-link.linkExpiration", {
                    expiration: exp("linkExpirationFormatter(linkExpiration)"),
                })}
            </Text>
            <Text>{t("identity-provider-link.ignoreMessage")}</Text>
            <Text>
                {t("identity-provider-link.loginInfo", {
                    identityProviderDisplayName: exp("identityProviderDisplayName"),
                    realmName: exp("realmName"),
                })}
            </Text>
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
    return t("identity-provider-link.subject");
};
