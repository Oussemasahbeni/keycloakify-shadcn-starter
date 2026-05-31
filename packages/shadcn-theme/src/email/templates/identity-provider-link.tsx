import i18n, { type TFunction } from "i18next";
import { Button, Text, render } from "jsx-email";
import type { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";
import { btnTextColor, primaryColor } from "../constants";
import { EmailLayout } from "../layout";
import { previewLocale } from "../utils/previewLocale";
import { applyRTL } from "../utils/RTL";

type TemplateProps = Omit<GetTemplateProps, "plainText"> & { t: TFunction };

const paragraph = {
    lineHeight: 1.5,
    fontSize: 14,
    textAlign: "left" as const
};

const rtlStyle = {
    direction: "rtl" as const,
    textAlign: "right" as const
};

export const previewProps: TemplateProps = {
    t: i18n.getFixedT(previewLocale),
    locale: previewLocale,
    themeName: "vanilla"
};

export const templateName = "Identity Provider Link";

const { exp } = createVariablesHelper("identity-provider-link.ftl");

export const Template = ({ locale, t }: TemplateProps) => {
    const isRTL = locale === "ar";

    return (
        <EmailLayout preview={t("identity-provider-link.subject")} locale={locale}>
            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.message", {
                    identityProviderDisplayName: exp("identityProviderDisplayName"),
                    realmName: exp("realmName"),
                    username: exp("identityProviderContext.username")
                })}
            </Text>

            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.clickLink")}
            </Text>

            <Button
                width={200}
                align={isRTL ? "right" : "left"}
                height={40}
                backgroundColor={primaryColor}
                textColor={btnTextColor}
                borderRadius={3}
                fontSize={15}
                href={exp("link")}
            >
                {t("identity-provider-link.linkAccountsButton")}
            </Button>
            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.linkExpiration", {
                    expiration: exp("linkExpirationFormatter(linkExpiration)")
                })}
            </Text>
            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.ignoreMessage")}
            </Text>
            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.loginInfo", {
                    identityProviderDisplayName: exp("identityProviderDisplayName"),
                    realmName: exp("realmName")
                })}
            </Text>
        </EmailLayout>
    );
};

export const getTemplate: GetTemplate = async props => {
    const t = i18n.getFixedT(props.locale);
    return await render(<Template {...props} t={t} />, { plainText: props.plainText });
};

export const getSubject: GetSubject = async props => {
    const t = i18n.getFixedT(props.locale);
    return t("identity-provider-link.subject");
};
