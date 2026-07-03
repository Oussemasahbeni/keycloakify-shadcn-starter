/**
 * Primary language subtags that are written right-to-left. Detection compares
 * the language part only, so region variants (e.g. `ar-EG`, `fa-IR`) resolve
 * correctly.
 */
const RTL_LANGUAGES = new Set([
    "ar", // Arabic
    "dv", // Divehi
    "fa", // Persian
    "he", // Hebrew
    "ks", // Kashmiri
    "ps", // Pashto
    "sd", // Sindhi
    "ug", // Uyghur
    "ur", // Urdu
    "yi", // Yiddish
]);

/** Whether an email should render right-to-left for the given locale. */
export function isRtlLocale(locale: string): boolean {
    return RTL_LANGUAGES.has(locale.split("-")[0].toLowerCase());
}
