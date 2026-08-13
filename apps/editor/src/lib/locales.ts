/**
 * Locales supported by the theme's login i18n, The `value` is the Keycloak language tag set on
 * `kcContext.locale.currentLanguageTag`.
 */
export const supportedLocales = [
    { value: "ar", label: "Arabic (العربية)" },
    { value: "az", label: "Azerbaijani (Azərbaycan)" },
    { value: "ca", label: "Catalan (Català)" },
    { value: "cs", label: "Czech (čeština)" },
    { value: "da", label: "Danish (dansk)" },
    { value: "de", label: "German (Deutsch)" },
    { value: "el", label: "Greek (Ελληνικά)" },
    { value: "en", label: "English (English)" },
    { value: "es", label: "Spanish (español)" },
    { value: "eu", label: "Basque (euskara)" },
    { value: "fa", label: "Persian (فارسی)" },
    { value: "fi", label: "Finnish (suomi)" },
    { value: "fr", label: "French (français)" },
    { value: "hr", label: "Croatian (hrvatski)" },
    { value: "hu", label: "Hungarian (magyar)" },
    { value: "hy", label: "Armenian (հայերեն)" },
    { value: "id", label: "Indonesian (Bahasa Indonesia)" },
    { value: "it", label: "Italian (italiano)" },
    { value: "ja", label: "Japanese (日本語)" },
    { value: "ka", label: "Georgian (ქართული)" },
    { value: "kk", label: "Kazakh (қазақ)" },
    { value: "ky", label: "Kyrgyz (кыргыз)" },
    { value: "lt", label: "Lithuanian (lietuvių)" },
    { value: "lv", label: "Latvian (latviešu)" },
    { value: "nl", label: "Dutch (Nederlands)" },
    { value: "no", label: "Norwegian (norsk)" },
    { value: "pl", label: "Polish (polski)" },
    { value: "pt", label: "Portuguese (português)" },
    { value: "pt-BR", label: "Portuguese (Brazil)" },
    { value: "ro", label: "Romanian (română)" },
    { value: "ru", label: "Russian (русский)" },
    { value: "sk", label: "Slovak (slovenčina)" },
    { value: "sl", label: "Slovenian (slovenščina)" },
    { value: "sv", label: "Swedish (svenska)" },
    { value: "th", label: "Thai (ไทย)" },
    { value: "tr", label: "Turkish (Türkçe)" },
    { value: "uk", label: "Ukrainian (українська)" },
    { value: "vi", label: "Vietnamese (Tiếng Việt)" },
    { value: "zh-CN", label: "Chinese (Simplified) (中文简体)" },
    { value: "zh-TW", label: "Chinese (Traditional) (中文繁體)" },
] as const;

export const LOCALES = supportedLocales.map(l => l.value);

export type Locale = (typeof supportedLocales)[number]["value"];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COUNT = supportedLocales.length;
