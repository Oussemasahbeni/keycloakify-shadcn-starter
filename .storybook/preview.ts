import type { Preview } from "@storybook/react-vite";
import { createElement } from "react";

import {
    DEFAULT_FONT,
    DEFAULT_LOCALE,
    DEFAULT_THEME_BASE,
    DEFAULT_THEME_LAYOUT,
    DEFAULT_THEME_LOGO_DARK_URL,
    DEFAULT_THEME_LOGO_WHITE_URL,
    DEFAULT_THEME_PLACEHOLDER,
    DEFAULT_THEME_PRESET,
    DEFAULT_THEME_RADIUS
} from "../src/login/components/Template/Defaults";
import {
    basePaletteOptions,
    radiusPresetOptions,
    themePresetOptions
} from "../src/login/components/Template/theme/ThemeTypes";

const preview: Preview = {
    args: {
        logoWhiteUrl: "",
        logoDarkUrl: "",
        sideImageUrl: ""
    },
    argTypes: {
        logoWhiteUrl: {
            name: "Logo (Light)",
            control: "text",
            description: "Logo URL used in light mode"
        },
        logoDarkUrl: {
            name: "Logo (Dark)",
            control: "text",
            description: "Logo URL used in dark mode"
        },
        sideImageUrl: {
            name: "Side Image",
            control: "text",
            description: "Side image URL used in two-column layout"
        }
    },
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    },
    globalTypes: {
        showPlaceholder: {
            name: "Show Placeholder",
            description: "Show placeholder content in the theme",
            defaultValue: "true",
            toolbar: {
                icon: "eye",
                items: [
                    { value: "true", title: "Show Placeholder" },
                    { value: "false", title: "Hide Placeholder" }
                ]
            }
        },
        layout: {
            name: "Layout",
            description: "Keycloak layout",
            defaultValue: "two-column",
            toolbar: {
                icon: "mirror",
                items: ["two-column", "centered-card", "image-aside"]
            }
        },
        locale: {
            name: "Locale",
            description: "Keycloak locale",
            defaultValue: "en",
            toolbar: {
                icon: "globe",
                items: [
                    { value: "ar", title: "Arabic (العربية)" },
                    { value: "ca", title: "Catalan (Català)" },
                    { value: "cs", title: "Czech (čeština)" },
                    { value: "da", title: "Danish (dansk)" },
                    { value: "de", title: "German (Deutsch)" },
                    { value: "el", title: "Greek (Ελληνικά)" },
                    { value: "en", title: "English (English)" },
                    { value: "es", title: "Spanish (español)" },
                    { value: "fa", title: "Persian (فارسی)" },
                    { value: "fi", title: "Finnish (suomi)" },
                    { value: "fr", title: "French (français)" },
                    { value: "hu", title: "Hungarian (magyar)" },
                    { value: "it", title: "Italian (italiano)" },
                    { value: "ja", title: "Japanese (日本語)" },
                    { value: "ka", title: "Georgian (ქართული)" },
                    { value: "lt", title: "Lithuanian (lietuvių)" },
                    { value: "lv", title: "Latvian (latviešu)" },
                    { value: "nl", title: "Dutch (Nederlands)" },
                    { value: "no", title: "Norwegian (norsk)" },
                    { value: "pl", title: "Polish (polski)" },
                    { value: "pt", title: "Portuguese (português)" },
                    { value: "pt-BR", title: "Portuguese (Brazil)" },
                    { value: "ru", title: "Russian (русский)" },
                    { value: "sk", title: "Slovak (slovenčina)" },
                    { value: "sv", title: "Swedish (svenska)" },
                    { value: "th", title: "Thai (ไทย)" },
                    { value: "tr", title: "Turkish (Türkçe)" },
                    { value: "uk", title: "Ukrainian (українська)" },
                    { value: "zh-CN", title: "Chinese (Simplified) (中文简体)" },
                    { value: "zh-TW", title: "Chinese (Traditional) (中文繁體)" }
                ]
            }
        },
        themePreset: {
            name: "Theme",
            description: "Keycloak theme preset",
            defaultValue: "neutral",
            toolbar: {
                icon: "paintbrush",
                items: [...themePresetOptions]
            }
        },
        themeBase: {
            name: "Base",
            description: "Keycloak base palette",
            defaultValue: "neutral",
            toolbar: {
                icon: "contrast",
                items: [...basePaletteOptions]
            }
        },
        themeRadius: {
            name: "Radius",
            description: "Keycloak radius preset",
            defaultValue: "default",
            toolbar: {
                icon: "circlehollow",
                items: [...radiusPresetOptions]
            }
        },
        themeFont: {
            name: "Font",
            description: "Theme font preset",
            defaultValue: "geist",
            toolbar: {
                icon: "paragraph",
                items: [
                    { value: "inter", title: "Inter" },
                    { value: "geist", title: "Geist" },
                    { value: "manrope", title: "Manrope" },
                    { value: "figtree", title: "Figtree" },
                    { value: "source-sans-3", title: "Source Sans 3" },
                    { value: "ibm-plex-sans", title: "IBM Plex Sans" },
                    { value: "lora", title: "Lora" },
                    { value: "playfair-display", title: "Playfair Display" },
                    { value: "jetbrains-mono", title: "JetBrains Mono" }
                ]
            }
        }
    },
    decorators: [
        (Story, context) => {
            const locale = String(context.globals.locale ?? DEFAULT_LOCALE);
            const layout = String(context.globals.layout ?? DEFAULT_THEME_LAYOUT);
            const themePreset = String(
                context.globals.themePreset ?? DEFAULT_THEME_PRESET
            );
            const themeBase = String(context.globals.themeBase ?? DEFAULT_THEME_BASE);
            const themeRadius = String(
                context.globals.themeRadius ?? DEFAULT_THEME_RADIUS
            );
            const showPlaceholder = String(
                context.globals.showPlaceholder ?? DEFAULT_THEME_PLACEHOLDER
            );
            const font = String(context.globals.themeFont ?? DEFAULT_FONT);
            const logoWhiteUrl = String(
                context.args.logoWhiteUrl ?? DEFAULT_THEME_LOGO_WHITE_URL
            );
            const logoDarkUrl = String(
                context.args.logoDarkUrl ?? DEFAULT_THEME_LOGO_DARK_URL
            );

            const themeSideImageUrl = String(context.args.sideImageUrl ?? "");

            const storyArgs = {
                ...context.args,
                kcContext: {
                    ...context.args.kcContext,
                    locale: {
                        ...context.args.kcContext?.locale,
                        currentLanguageTag: locale
                    },
                    properties: {
                        ...context.args.kcContext?.properties,
                        SHADCN_THEME_LOGO_WHITE_URL: logoWhiteUrl,
                        SHADCN_THEME_LOGO_DARK_URL: logoDarkUrl,
                        SHADCN_THEME_SIDE_IMAGE_URL: themeSideImageUrl,
                        SHADCN_THEME_LAYOUT: layout,
                        SHADCN_THEME_PRESET: themePreset,
                        SHADCN_THEME_BASE: themeBase,
                        SHADCN_THEME_RADIUS: themeRadius,
                        SHADCN_THEME_PLACEHOLDER: showPlaceholder,
                        SHADCN_THEME_FONT: font
                    }
                }
            };

            return createElement(Story as never, {
                args: storyArgs,
                key: `${context.id}-${layout}-${locale}-${themePreset}-${themeBase}-${themeRadius}-${showPlaceholder}-${font}`
            });
        }
    ]
};

export default preview;
