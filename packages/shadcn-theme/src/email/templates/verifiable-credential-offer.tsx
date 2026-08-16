import type { TFunction } from "i18next";
import { Button, Text, render } from "jsx-email";
import type { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";

import { previewLocale } from "../constants";
import i18n from "../i18n";
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

export const templateName = "Verifiable Credential Offer";

const { exp } = createVariablesHelper("verifiable-credential-offer.ftl");

export const Template = ({ locale, t, theme }: TemplateProps) => {
    const isRTL = isRtlLocale(locale);
    return (
        <EmailLayout preview={t("verifiable-credential-offer.preview")} locale={locale} theme={theme}>
            <Text>
                <p>
                    {t("verifiable-credential-offer.message", {
                        realmName: exp("realmName"),
                        credentialScopeDisplayName: exp("credentialScopeDisplayName"),
                    })}
                </p>
                <Button
                    width={350}
                    align={isRTL ? "right" : "left"}
                    height={40}
                    backgroundColor={theme.primaryColor}
                    textColor={theme.foregroundColor}
                    borderRadius={3}
                    href={exp("link")}
                >
                    {t("verifiable-credential-offer.claimLink", {
                        credentialScopeDisplayName: exp("credentialScopeDisplayName"),
                    })}
                </Button>
                <p>
                    {t("verifiable-credential-offer.linkExpiration", {
                        expiration: exp("linkExpirationFormatter(linkExpiration)"),
                    })}
                </p>
                <p>
                    {t("verifiable-credential-offer.expiredMessage", {
                        realmName: exp("realmName"),
                        credentialScopeDisplayName: exp("credentialScopeDisplayName"),
                    })}
                </p>
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
    return t("verifiable-credential-offer.subject");
};
