import { SITE_URL } from "#/config/constants.ts";
import { AboutSection } from "#/features/landing/about-section";
import { FaqSection, faqItems } from "#/features/landing/faq-section";
import { LandingFooter } from "#/features/landing/footer";
import { Header } from "#/features/landing/header";
import { HeroSection } from "#/features/landing/hero-section";
import { StatsSection } from "#/features/landing/stats-section";
import { seo } from "#/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

const TITLE = "Keycloak Theme Editor — Visually customize Keycloak login themes";
const DESCRIPTION =
    "An open-source visual editor for Keycloak login themes. Customize colors, fonts, radius, and layout with shadcn/ui, preview every login page live, and export a deploy-ready Keycloakify theme.";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: seo({
            title: TITLE,
            description: DESCRIPTION,
            keywords:
                "Keycloak, Keycloak theme, Keycloakify, login theme, theme editor, shadcn/ui, Tailwind CSS, OIDC, SSO",
            image: "/editor-preview-white.png",
            url: "/",
        }),
        links: [{ rel: "canonical", href: `${SITE_URL}/` }],
        scripts: [
            {
                type: "application/ld+json",
                children: JSON.stringify(structuredData()),
            },
        ],
    }),
    component: Landing,
});

function structuredData() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: "Keycloak Theme Editor",
                description: DESCRIPTION,
            },
            {
                "@type": "SoftwareApplication",
                "@id": `${SITE_URL}/#app`,
                name: "Keycloak Theme Editor",
                description: DESCRIPTION,
                url: `${SITE_URL}/`,
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web",
                image: `${SITE_URL}/editor-preview-white.png`,
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
            },
            {
                "@type": "FAQPage",
                "@id": `${SITE_URL}/#faq`,
                mainEntity: faqItems.map(item => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.answer,
                    },
                })),
            },
        ],
    };
}

export function Landing() {
    return (
        <div className="flex flex-col min-h-svh">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <StatsSection />
                <AboutSection />
                <FaqSection />
            </main>
            <LandingFooter />
        </div>
    );
}
