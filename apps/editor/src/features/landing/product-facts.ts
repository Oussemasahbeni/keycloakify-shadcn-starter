/** Sizes of the theme's option sets, as advertised in the stats band. */
export const OPTION_COUNTS = {
    primaryPresets: 18,
    basePalettes: 7,
    radiusPresets: 5,
    fontFamilies: 9,
    layouts: 3,
} as const;

/**
 * The light-mode `primary` of every accent preset, duplicated verbatim from
 * `packages/shadcn-theme/src/login/theme/Presets.ts` so the landing page can
 * show real product colors without importing the theme at runtime.
 */
export const PRESET_SWATCHES = [
    { name: "neutral", color: "oklch(0.205 0 0)" },
    { name: "red", color: "oklch(0.505 0.213 27.518)" },
    { name: "orange", color: "oklch(0.553 0.195 38.402)" },
    { name: "amber", color: "oklch(0.555 0.163 48.998)" },
    { name: "yellow", color: "oklch(0.852 0.199 91.936)" },
    { name: "lime", color: "oklch(0.532 0.157 131.589)" },
    { name: "green", color: "oklch(0.532 0.157 131.589)" },
    { name: "emerald", color: "oklch(0.508 0.118 165.612)" },
    { name: "teal", color: "oklch(0.511 0.096 186.391)" },
    { name: "cyan", color: "oklch(0.52 0.105 223.128)" },
    { name: "sky", color: "oklch(0.5 0.134 242.749)" },
    { name: "blue", color: "oklch(0.488 0.243 264.376)" },
    { name: "indigo", color: "oklch(0.457 0.24 277.023)" },
    { name: "violet", color: "oklch(0.491 0.27 292.581)" },
    { name: "purple", color: "oklch(0.496 0.265 301.924)" },
    { name: "fuchsia", color: "oklch(0.518 0.253 323.949)" },
    { name: "pink", color: "oklch(0.525 0.223 3.958)" },
    { name: "rose", color: "oklch(0.514 0.222 16.935)" },
] as const;
