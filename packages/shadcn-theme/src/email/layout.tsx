import { Body, Column, Container, Head, Html, Img, Preview, Row, Section, Text } from "jsx-email";
import { If } from "keycloakify-emails/jsx-email";
import { createVariablesHelper } from "keycloakify-emails/variables";
import type { PropsWithChildren, ReactNode } from "react";
import i18n from "./i18n";
import { isRtlLocale } from "./rtl";
import { EMAIL_ENV, type EmailTheme } from "./theme/theme";

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    width: "580px",
    margin: "30px auto",
    backgroundColor: "#ffffff",
};

const content = {
    padding: "5px 30px 10px 30px",
};

const logo = {
    display: "flex",
    justifyContent: "center",
    alingItems: "center",
    padding: 30,
};

const logoImage = {
    display: "block",
    border: "0",
    outline: "none",
    textDecoration: "none",
    maxWidth: "100%",
};

const sectionsBordersBottom = {
    width: "100%",
    display: "flex",
    marginBottom: "20px",
};

const sectionBorder = {
    borderBottom: "1px solid rgb(238,238,238)",
    width: "249px",
};

const footer = {
    width: "580px",
    margin: "0 auto",
};

const currentYear = new Date().getFullYear();

const { exp } = createVariablesHelper("email-test.ftl");

export const EmailLayout = ({
    locale,
    children,
    preview,
    theme,
}: PropsWithChildren<{ preview: ReactNode; locale: string; theme: EmailTheme }>) => {
    const t = i18n.getFixedT(locale);

    const sectionCenter = {
        borderBottom: `1px solid ${theme.primaryColor}`,
        width: "102px",
    };

    const baseUrl = import.meta.isJsxEmailPreview
      ? "/assets"
      : "${url.resourcesUrl}";
    // `theme.logoUrl` is a real URL in the preview but a FreeMarker token
    // (always truthy) in the built template. Render the same markup either way,
    // but gate it differently: a runtime `<#if …?has_content>` in the template
    // so an unset property emits no `<img>`, and a plain JS check in the preview.
    const logoSection = (
        <Section style={logo}>
            <Img
                src={theme.logoUrl ||`${baseUrl}/logo.png`}
                width={200}
                height={50}
                alt={exp("realmName")}
                style={logoImage}
            />
        </Section>
    );
    const logoNode = theme.ftl ? (
        <If condition={`(properties.${EMAIL_ENV.logoUrl.name}!'')?has_content`}>
            {logoSection}
        </If>
    ) : theme.logoUrl ? (
        logoSection
    ) : null;

    return (
        <Html lang={locale} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
            <Head />
            <Preview>{preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {logoNode}

                    <Section style={content}>{children}</Section>

                    <Section style={sectionsBordersBottom}>
                        <Row>
                            <Column style={sectionBorder} />
                            <Column style={sectionCenter} />
                            <Column style={sectionBorder} />
                        </Row>
                    </Section>
                    <Section style={footer}>
                        <Row>
                            <Text style={{ textAlign: "center", color: "#706a7b" }}>
                                {t("footer.allRightsReserved", {
                                    currentYear,
                                    realmName: exp("realmName"),
                                })}
                            </Text>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};
