import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "#/config/constants.ts";
import { SectionHeader } from "#/features/landing/band";
import { CompareSection } from "#/features/landing/compare-section";
import { CtaSection } from "#/features/landing/cta-section";
import { FaqSection, faqItems } from "#/features/landing/faq-section";
import { FeaturePanels } from "#/features/landing/feature-panels";
import { LandingFooter } from "#/features/landing/footer";
import { Header } from "#/features/landing/header";
import { HeroSection } from "#/features/landing/hero-section";
import { ProblemSection } from "#/features/landing/problem-section";
import { StatsSection } from "#/features/landing/stats-section";
import { TechStrip } from "#/features/landing/tech-strip";
import { ThemeGallery } from "#/features/landing/theme-gallery";
import { seo } from "#/lib/seo.ts";

const TITLE = "Keycloak Theme Editor — Visually customize Keycloak login themes";
const DESCRIPTION =
    "A visual editor for Keycloak login themes. Customize colors, fonts, radius, and layout, preview every login and registration page live, and export a deploy-ready Keycloakify theme.";

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
    component: Home,
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

function Home() {
    return (
        <div className="flex min-h-svh flex-col">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <ProblemSection />

                <SectionHeader
                    id="gallery"
                    eyebrow="Made with the editor"
                    title="One theme, however you want it to look"
                    lede="Every screen below came out of the editor — different layouts, typefaces and palettes, on the pages your users actually reach."
                />
                <ThemeGallery />

                <TechStrip />

                <SectionHeader
                    id="compare"
                    eyebrow="Before & after"
                    title="The same login page, minutes apart"
                    lede="On the left, what Keycloak serves out of the box. On the right, the same page after a few minutes in the editor — no FreeMarker, no CSS."
                />
                <CompareSection />

                <SectionHeader
                    id="features"
                    eyebrow="What you get"
                    title="From editor to deployed theme"
                    lede="Design it visually, check it against the real pages, and leave with an artifact your ops team can deploy."
                />
                <FeaturePanels />
                <StatsSection />

                <SectionHeader eyebrow="FAQ" title="Questions, answered" />
                <FaqSection />

                <CtaSection />
            </main>
            <LandingFooter />
        </div>
    );
}
