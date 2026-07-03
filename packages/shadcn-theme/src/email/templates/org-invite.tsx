import i18n, { type TFunction } from "i18next";
import { Button, Text, render } from "jsx-email";
import type { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import * as Fm from "keycloakify-emails/jsx-email";
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

export const templateName = "Org Invite";

const { exp, v } = createVariablesHelper("org-invite.ftl");

export const Template = ({ locale, t, theme }: TemplateProps) => {
    const isRTL = isRtlLocale(locale);

    return (
        <EmailLayout preview={t("org-invite.subject")} locale={locale} theme={theme}>
            <Text>
                <Fm.If condition={`${v("firstName")}?? && ${v("lastName")}??`}>
                    <p>
                        {t("org-invite.greeting", {
                            firstName: exp("firstName"),
                            lastName: exp("lastName"),
                        })}
                    </p>
                </Fm.If>
            </Text>

            <Text>{t("org-invite.message", { organizationName: exp("organization.name") })}</Text>

            <Button
                width={200}
                align={isRTL ? "right" : "left"}
                height={40}
                backgroundColor={theme.primaryColor}
                textColor={theme.buttonTextColor}
                borderRadius={3}
                href={exp("link")}
            >
                {t("org-invite.joinButton")}
            </Button>

            <Text>
                {t("org-invite.linkExpiration", {
                    expiration: exp("linkExpirationFormatter(linkExpiration)"),
                })}
            </Text>
            <Text>{t("org-invite.ignoreMessage")}</Text>
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
    return t("org-invite.subject");
};
