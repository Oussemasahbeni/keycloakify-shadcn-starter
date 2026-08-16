import { Body, Column, Container, Head, Html, Preview, Row, Section, Text } from "jsx-email";
import { createVariablesHelper } from "keycloakify-emails/variables";
import type { PropsWithChildren, ReactNode } from "react";

import { EmailLogo } from "./email-logo";
import i18n from "./i18n";
import { isRtlLocale } from "./rtl";
import { type EmailTheme } from "./theme/theme";

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    width: "580px",
    margin: "30px auto",
    backgroundColor: "#ffffff",
};

const content = {
    padding: "5px 30px 10px 30px",
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

    return (
        <Html lang={locale} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
            <Head />
            <Preview>{preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <EmailLogo theme={theme} />

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
