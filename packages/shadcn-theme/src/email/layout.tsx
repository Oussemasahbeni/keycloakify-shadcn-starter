import {
    Body,
    Column,
    Container,
    Head,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text
} from "jsx-email";
import { createVariablesHelper } from "keycloakify-emails/variables";
import type { PropsWithChildren, ReactNode } from "react";
import { companyLogo, primaryColor } from "./constants";
import i18n from "./i18n";

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif'
};

const container = {
    width: "580px",
    margin: "30px auto",
    backgroundColor: "#ffffff"
};

const content = {
    padding: "5px 30px 10px 30px"
};

const logo = {
    display: "flex",
    justifyContent: "center",
    alingItems: "center",
    padding: 30
};

const logoImage = {
    display: "block",
    border: "0",
    outline: "none",
    textDecoration: "none",
    maxWidth: "100%"
};

const sectionsBorders = {
    width: "100%",
    display: "flex"
};
const sectionsBordersBottom = {
    width: "100%",
    display: "flex",
    marginBottom: "20px"
};

const sectionBorder = {
    borderBottom: "1px solid rgb(238,238,238)",
    width: "249px"
};

const sectionCenter = {
    borderBottom: `1px solid ${primaryColor}`,
    width: "102px"
};

const footer = {
    width: "580px",
    margin: "0 auto"
};

const currentYear = new Date().getFullYear();

const { exp } = createVariablesHelper("email-test.ftl");

export const EmailLayout = ({
    locale,
    children,
    preview
}: PropsWithChildren<{ preview: ReactNode; locale: string }>) => {
    const t = i18n.getFixedT(locale);

    return (
        <Html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
            <Head />
            <Preview>{preview}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logo}>
                        <Img
                            src={companyLogo}
                            width={200}
                            height={50}
                            alt="Company Name"
                            style={logoImage}
                        />
                    </Section>

                    <Section style={sectionsBorders}>
                        <Row>
                            <Column style={sectionBorder} />
                            <Column style={sectionCenter} />
                            <Column style={sectionBorder} />
                        </Row>
                    </Section>

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
                                    realmName: exp("realmName")
                                })}
                            </Text>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};
