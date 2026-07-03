import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "#/components/ui/accordion";
import { Badge } from "#/components/ui/badge";
import { buttonVariants } from "#/components/ui/button";
import { DISCORD_INVITE_URL } from "#/config/constants.ts";

type FaqItem = {
    value: string;
    question: string;
    answer: string;
};

export const faqItems: FaqItem[] = [
    {
        value: "item-1",
        question: "What is the Keycloak Theme Editor?",
        answer: "It's a visual editor for Keycloak login themes. Instead of hand-writing FreeMarker templates and CSS, you tweak colors, fonts, radius, and layout in a live editor that renders the real theme, then export a ready-to-deploy theme for your Keycloak instance.",
    },
    {
        value: "item-2",
        question: "Is it free and open source?",
        answer: "Yes. The editor and the underlying shadcn/ui Keycloak theme are open source under the MIT license. You can use them in personal and commercial projects, self-host the editor, and contribute on GitHub.",
    },
    {
        value: "item-3",
        question: "How do I deploy the generated theme to Keycloak?",
        answer: "The theme builds into a Keycloakify JAR. Drop that JAR into your Keycloak server's providers/ directory, restart Keycloak, then select the theme under Realm settings → Themes → Login theme. Your customized login and registration pages go live immediately.",
    },
    {
        value: "item-4",
        question: "Can I customize colors, fonts, layouts, and radius?",
        answer: "Yes. Choose from 18 color presets and 7 neutral base palettes, 9 font families, multiple radius presets, and 3 layouts (two-column, centered card, and image-aside). Everything is built on OKLCH color tokens so light and dark mode stay consistent.",
    },
    {
        value: "item-5",
        question: "Does it support multiple languages?",
        answer: "The theme ships with built-in internationalization for 30 languages, including right-to-left locales. You can preview any login page in any supported language directly in the editor.",
    },
    {
        value: "item-6",
        question: "What is it built with?",
        answer: "The editor is a TanStack Start app, and the theme is built with Keycloakify v11, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui. It renders the real theme in an isolated preview, so what you see is exactly what Keycloak will serve.",
    },
];

export function FaqSection() {
    return (
        <section id="faq" className="py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <Badge variant="outline" className="mb-4">
                        FAQ
                    </Badge>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to know about the Keycloak Theme Editor, deployment, and
                        customization. Still have questions? We're here to help!
                    </p>
                </div>

                <div className="mx-auto max-w-4xl">
                    <Accordion className="space-y-5">
                        {faqItems.map(item => (
                            <AccordionItem
                                key={item.value}
                                value={item.value}
                                className="rounded-md border! bg-transparent"
                            >
                                <AccordionTrigger className="cursor-pointer items-center gap-4 rounded-none bg-transparent py-2 ps-3 pe-4 hover:no-underline data-[state=open]:border-b">
                                    <div className="flex items-center gap-4">
                                        <span className="text-start font-semibold">
                                            {item.question}
                                        </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-transparent p-4">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">
                            Still have questions? We're here to help.
                        </p>
                        <a
                            href={DISCORD_INVITE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({ className: "cursor-pointer" })}
                        >
                            Ask on Discord
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
