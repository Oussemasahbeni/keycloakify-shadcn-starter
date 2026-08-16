import { Text, render } from "jsx-email";
import type { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import * as Fm from "keycloakify-emails/jsx-email";
import { EmailLayout } from "../layout";
import { createVariablesHelper } from "keycloakify-emails/variables";
import type { TFunction } from "i18next";
import { defaultEmailTheme, ftlEmailTheme, type EmailTheme } from "../theme/theme";
import { previewLocale } from "../constants";
import i18n from "../i18n";

type TemplateProps = Omit<GetTemplateProps, "plainText"> & { t: TFunction; theme: EmailTheme };

export const previewProps: TemplateProps = {
    t: i18n.getFixedT(previewLocale),
    locale: previewLocale,
    themeName: "vanilla",
    theme: defaultEmailTheme,
};

export const templateName = "Workflow Notification";

const { exp, v } = createVariablesHelper("workflow-notification.ftl");

export const Template = ({ locale, t, theme }: TemplateProps) => (
    <EmailLayout preview={t("workflow-notification.preview")} locale={locale} theme={theme}>
        <Text>
            <h2>{Fm.exp("kcSanitize(msg(subjectKey, daysRemaining, reason))?no_esc")}</h2>

            <Fm.If condition={`${v("messageKey")} == "customMessage"`}>
                <Fm.Then>
                    <p>{Fm.exp("kcSanitize(customMessage)?no_esc")}</p>
                </Fm.Then>
                <Fm.Else>
                    <p>
                        {t("workflow-notification.greeting", {
                            name: Fm.exp("user.firstName!user.username"),
                        })}
                    </p>

                    <p>{Fm.exp("kcSanitize(msg(messageKey, daysRemaining, reason))?no_esc")}</p>

                    <Fm.If condition={`${v("daysRemaining")} gt 0`}>
                        <p>
                            <strong>
                                {t("workflow-notification.timeRemaining", {
                                    days: exp("daysRemaining"),
                                })}
                            </strong>
                        </p>
                    </Fm.If>

                    <p>{t("workflow-notification.contactAdmin", { realmName: exp("realmName") })}</p>

                    <p>
                        {t("workflow-notification.regards")}
                        <br />
                        {t("workflow-notification.signature", { realmName: exp("realmName") })}
                    </p>
                </Fm.Else>
            </Fm.If>
        </Text>
    </EmailLayout>
);

export const getTemplate: GetTemplate = async props => {
    const t = i18n.getFixedT(props.locale);
    return await render(<Template {...props} t={t} theme={ftlEmailTheme(exp)} />, {
        plainText: props.plainText,
    });
};

export const getSubject: GetSubject = async props => {
    const t = i18n.getFixedT(props.locale);
    return t("workflow-notification.subject");
};
