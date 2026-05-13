import type {
    AccentTokens,
    BasePalette,
    BaseSurfaceTokens,
    ModeTokens,
    RadiusPreset,
    ThemePreset
} from "./ThemeTypes";

/**
 * Base palettes define the neutral surface system of the UI.
 *
 * These values come from the shadcn base themes and therefore own:
 * - surfaces (`background`, `card`, `popover`)
 * - secondary/muted/accent states
 * - borders, inputs, and focus ring
 */
export const basePalettes: Record<BasePalette, ModeTokens<BaseSurfaceTokens>> = {
    neutral: {
        light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.145 0 0)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.145 0 0)",
            popover: "oklch(1 0 0)",
            popoverForeground: "oklch(0.145 0 0)",
            secondary: "oklch(0.97 0 0)",
            secondaryForeground: "oklch(0.205 0 0)",
            muted: "oklch(0.97 0 0)",
            mutedForeground: "oklch(0.556 0 0)",
            accent: "oklch(0.97 0 0)",
            accentForeground: "oklch(0.205 0 0)",
            border: "oklch(0.922 0 0)",
            input: "oklch(0.922 0 0)",
            ring: "oklch(0.708 0 0)"
        },
        dark: {
            background: "oklch(0.145 0 0)",
            foreground: "oklch(0.985 0 0)",
            card: "oklch(0.205 0 0)",
            cardForeground: "oklch(0.985 0 0)",
            popover: "oklch(0.205 0 0)",
            popoverForeground: "oklch(0.985 0 0)",
            secondary: "oklch(0.269 0 0)",
            secondaryForeground: "oklch(0.985 0 0)",
            muted: "oklch(0.269 0 0)",
            mutedForeground: "oklch(0.708 0 0)",
            accent: "oklch(0.269 0 0)",
            accentForeground: "oklch(0.985 0 0)",
            border: "oklch(1 0 0 / 10%)",
            input: "oklch(1 0 0 / 15%)",
            ring: "oklch(0.556 0 0)"
        }
    },
    stone: {
        light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.147 0.004 49.25)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.147 0.004 49.25)",
            popover: "oklch(1 0 0)",
            popoverForeground: "oklch(0.147 0.004 49.25)",
            secondary: "oklch(0.97 0.001 106.424)",
            secondaryForeground: "oklch(0.216 0.006 56.043)",
            muted: "oklch(0.97 0.001 106.424)",
            mutedForeground: "oklch(0.553 0.013 58.071)",
            accent: "oklch(0.97 0.001 106.424)",
            accentForeground: "oklch(0.216 0.006 56.043)",
            border: "oklch(0.923 0.003 48.717)",
            input: "oklch(0.923 0.003 48.717)",
            ring: "oklch(0.709 0.01 56.259)"
        },
        dark: {
            background: "oklch(0.147 0.004 49.25)",
            foreground: "oklch(0.985 0.001 106.423)",
            card: "oklch(0.216 0.006 56.043)",
            cardForeground: "oklch(0.985 0.001 106.423)",
            popover: "oklch(0.216 0.006 56.043)",
            popoverForeground: "oklch(0.985 0.001 106.423)",
            secondary: "oklch(0.268 0.007 34.298)",
            secondaryForeground: "oklch(0.985 0.001 106.423)",
            muted: "oklch(0.268 0.007 34.298)",
            mutedForeground: "oklch(0.709 0.01 56.259)",
            accent: "oklch(0.268 0.007 34.298)",
            accentForeground: "oklch(0.985 0.001 106.423)",
            border: "oklch(1 0 0 / 10%)",
            input: "oklch(1 0 0 / 15%)",
            ring: "oklch(0.553 0.013 58.071)"
        }
    },
    zinc: {
        light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.141 0.005 285.823)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.141 0.005 285.823)",
            popover: "oklch(1 0 0)",
            popoverForeground: "oklch(0.141 0.005 285.823)",
            secondary: "oklch(0.967 0.001 286.375)",
            secondaryForeground: "oklch(0.21 0.006 285.885)",
            muted: "oklch(0.967 0.001 286.375)",
            mutedForeground: "oklch(0.552 0.016 285.938)",
            accent: "oklch(0.967 0.001 286.375)",
            accentForeground: "oklch(0.21 0.006 285.885)",
            border: "oklch(0.92 0.004 286.32)",
            input: "oklch(0.92 0.004 286.32)",
            ring: "oklch(0.705 0.015 286.067)"
        },
        dark: {
            background: "oklch(0.141 0.005 285.823)",
            foreground: "oklch(0.985 0 0)",
            card: "oklch(0.21 0.006 285.885)",
            cardForeground: "oklch(0.985 0 0)",
            popover: "oklch(0.21 0.006 285.885)",
            popoverForeground: "oklch(0.985 0 0)",
            secondary: "oklch(0.274 0.006 286.033)",
            secondaryForeground: "oklch(0.985 0 0)",
            muted: "oklch(0.274 0.006 286.033)",
            mutedForeground: "oklch(0.705 0.015 286.067)",
            accent: "oklch(0.274 0.006 286.033)",
            accentForeground: "oklch(0.985 0 0)",
            border: "oklch(1 0 0 / 10%)",
            input: "oklch(1 0 0 / 15%)",
            ring: "oklch(0.552 0.016 285.938)"
        }
    },
    mauve: {
        light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.145 0.008 326)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.145 0.008 326)",
            popover: "oklch(1 0 0)",
            popoverForeground: "oklch(0.145 0.008 326)",
            secondary: "oklch(0.96 0.003 325.6)",
            secondaryForeground: "oklch(0.212 0.019 322.12)",
            muted: "oklch(0.96 0.003 325.6)",
            mutedForeground: "oklch(0.542 0.034 322.5)",
            accent: "oklch(0.96 0.003 325.6)",
            accentForeground: "oklch(0.212 0.019 322.12)",
            border: "oklch(0.922 0.005 325.62)",
            input: "oklch(0.922 0.005 325.62)",
            ring: "oklch(0.711 0.019 323.02)"
        },
        dark: {
            background: "oklch(0.145 0.008 326)",
            foreground: "oklch(0.985 0 0)",
            card: "oklch(0.212 0.019 322.12)",
            cardForeground: "oklch(0.985 0 0)",
            popover: "oklch(0.212 0.019 322.12)",
            popoverForeground: "oklch(0.985 0 0)",
            secondary: "oklch(0.263 0.024 320.12)",
            secondaryForeground: "oklch(0.985 0 0)",
            muted: "oklch(0.263 0.024 320.12)",
            mutedForeground: "oklch(0.711 0.019 323.02)",
            accent: "oklch(0.263 0.024 320.12)",
            accentForeground: "oklch(0.985 0 0)",
            border: "oklch(1 0 0 / 10%)",
            input: "oklch(1 0 0 / 15%)",
            ring: "oklch(0.542 0.034 322.5)"
        }
    },
    olive: {
        light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.153 0.006 107.1)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.153 0.006 107.1)",
            popover: "oklch(1 0 0)",
            popoverForeground: "oklch(0.153 0.006 107.1)",
            secondary: "oklch(0.966 0.005 106.5)",
            secondaryForeground: "oklch(0.228 0.013 107.4)",
            muted: "oklch(0.966 0.005 106.5)",
            mutedForeground: "oklch(0.58 0.031 107.3)",
            accent: "oklch(0.966 0.005 106.5)",
            accentForeground: "oklch(0.228 0.013 107.4)",
            border: "oklch(0.93 0.007 106.5)",
            input: "oklch(0.93 0.007 106.5)",
            ring: "oklch(0.737 0.021 106.9)"
        },
        dark: {
            background: "oklch(0.153 0.006 107.1)",
            foreground: "oklch(0.988 0.003 106.5)",
            card: "oklch(0.228 0.013 107.4)",
            cardForeground: "oklch(0.988 0.003 106.5)",
            popover: "oklch(0.228 0.013 107.4)",
            popoverForeground: "oklch(0.988 0.003 106.5)",
            secondary: "oklch(0.286 0.016 107.4)",
            secondaryForeground: "oklch(0.988 0.003 106.5)",
            muted: "oklch(0.286 0.016 107.4)",
            mutedForeground: "oklch(0.737 0.021 106.9)",
            accent: "oklch(0.286 0.016 107.4)",
            accentForeground: "oklch(0.988 0.003 106.5)",
            border: "oklch(1 0 0 / 10%)",
            input: "oklch(1 0 0 / 15%)",
            ring: "oklch(0.58 0.031 107.3)"
        }
    },
    mist: {
        light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.148 0.004 228.8)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.148 0.004 228.8)",
            popover: "oklch(1 0 0)",
            popoverForeground: "oklch(0.148 0.004 228.8)",
            secondary: "oklch(0.963 0.002 197.1)",
            secondaryForeground: "oklch(0.218 0.008 223.9)",
            muted: "oklch(0.963 0.002 197.1)",
            mutedForeground: "oklch(0.56 0.021 213.5)",
            accent: "oklch(0.963 0.002 197.1)",
            accentForeground: "oklch(0.218 0.008 223.9)",
            border: "oklch(0.925 0.005 214.3)",
            input: "oklch(0.925 0.005 214.3)",
            ring: "oklch(0.723 0.014 214.4)"
        },
        dark: {
            background: "oklch(0.148 0.004 228.8)",
            foreground: "oklch(0.987 0.002 197.1)",
            card: "oklch(0.218 0.008 223.9)",
            cardForeground: "oklch(0.987 0.002 197.1)",
            popover: "oklch(0.218 0.008 223.9)",
            popoverForeground: "oklch(0.987 0.002 197.1)",
            secondary: "oklch(0.275 0.011 216.9)",
            secondaryForeground: "oklch(0.987 0.002 197.1)",
            muted: "oklch(0.275 0.011 216.9)",
            mutedForeground: "oklch(0.723 0.014 214.4)",
            accent: "oklch(0.275 0.011 216.9)",
            accentForeground: "oklch(0.987 0.002 197.1)",
            border: "oklch(1 0 0 / 10%)",
            input: "oklch(1 0 0 / 15%)",
            ring: "oklch(0.56 0.021 213.5)"
        }
    },
    taupe: {
        light: {
            background: "oklch(1 0 0)",
            foreground: "oklch(0.147 0.004 49.3)",
            card: "oklch(1 0 0)",
            cardForeground: "oklch(0.147 0.004 49.3)",
            popover: "oklch(1 0 0)",
            popoverForeground: "oklch(0.147 0.004 49.3)",
            secondary: "oklch(0.96 0.002 17.2)",
            secondaryForeground: "oklch(0.214 0.009 43.1)",
            muted: "oklch(0.96 0.002 17.2)",
            mutedForeground: "oklch(0.547 0.021 43.1)",
            accent: "oklch(0.96 0.002 17.2)",
            accentForeground: "oklch(0.214 0.009 43.1)",
            border: "oklch(0.922 0.005 34.3)",
            input: "oklch(0.922 0.005 34.3)",
            ring: "oklch(0.714 0.014 41.2)"
        },
        dark: {
            background: "oklch(0.147 0.004 49.3)",
            foreground: "oklch(0.986 0.002 67.8)",
            card: "oklch(0.214 0.009 43.1)",
            cardForeground: "oklch(0.986 0.002 67.8)",
            popover: "oklch(0.214 0.009 43.1)",
            popoverForeground: "oklch(0.986 0.002 67.8)",
            secondary: "oklch(0.268 0.011 36.5)",
            secondaryForeground: "oklch(0.986 0.002 67.8)",
            muted: "oklch(0.268 0.011 36.5)",
            mutedForeground: "oklch(0.714 0.014 41.2)",
            accent: "oklch(0.268 0.011 36.5)",
            accentForeground: "oklch(0.986 0.002 67.8)",
            border: "oklch(1 0 0 / 10%)",
            input: "oklch(1 0 0 / 15%)",
            ring: "oklch(0.547 0.021 43.1)"
        }
    }
};

/**
 * Accent presets define the primary brand color family layered on top of a base palette.
 *
 * These values come from the shadcn accent themes. We intentionally only keep
 * the primary tokens here because the rest of the neutral system is already
 * handled by the selected base palette.
 */
export const themePresets: Record<ThemePreset, ModeTokens<AccentTokens>> = {
    neutral: {
        light: {
            primary: "oklch(0.205 0 0)",
            primaryForeground: "oklch(0.985 0 0)"
        },
        dark: {
            primary: "oklch(0.922 0 0)",
            primaryForeground: "oklch(0.205 0 0)"
        }
    },
    amber: {
        light: {
            primary: "oklch(0.555 0.163 48.998)",
            primaryForeground: "oklch(0.987 0.022 95.277)"
        },
        dark: {
            primary: "oklch(0.473 0.137 46.201)",
            primaryForeground: "oklch(0.987 0.022 95.277)"
        }
    },
    blue: {
        light: {
            primary: "oklch(0.488 0.243 264.376)",
            primaryForeground: "oklch(0.97 0.014 254.604)"
        },
        dark: {
            primary: "oklch(0.424 0.199 265.638)",
            primaryForeground: "oklch(0.97 0.014 254.604)"
        }
    },
    cyan: {
        light: {
            primary: "oklch(0.52 0.105 223.128)",
            primaryForeground: "oklch(0.984 0.019 200.873)"
        },
        dark: {
            primary: "oklch(0.45 0.085 224.283)",
            primaryForeground: "oklch(0.984 0.019 200.873)"
        }
    },
    emerald: {
        light: {
            primary: "oklch(0.508 0.118 165.612)",
            primaryForeground: "oklch(0.979 0.021 166.113)"
        },
        dark: {
            primary: "oklch(0.432 0.095 166.913)",
            primaryForeground: "oklch(0.979 0.021 166.113)"
        }
    },
    fuchsia: {
        light: {
            primary: "oklch(0.518 0.253 323.949)",
            primaryForeground: "oklch(0.977 0.017 320.058)"
        },
        dark: {
            primary: "oklch(0.452 0.211 324.591)",
            primaryForeground: "oklch(0.977 0.017 320.058)"
        }
    },
    green: {
        light: {
            primary: "oklch(0.532 0.157 131.589)",
            primaryForeground: "oklch(0.986 0.031 120.757)"
        },
        dark: {
            primary: "oklch(0.453 0.124 130.933)",
            primaryForeground: "oklch(0.986 0.031 120.757)"
        }
    },
    indigo: {
        light: {
            primary: "oklch(0.457 0.24 277.023)",
            primaryForeground: "oklch(0.962 0.018 272.314)"
        },
        dark: {
            primary: "oklch(0.398 0.195 277.366)",
            primaryForeground: "oklch(0.962 0.018 272.314)"
        }
    },
    lime: {
        light: {
            primary: "oklch(0.532 0.157 131.589)",
            primaryForeground: "oklch(0.986 0.031 120.757)"
        },
        dark: {
            primary: "oklch(0.453 0.124 130.933)",
            primaryForeground: "oklch(0.986 0.031 120.757)"
        }
    },
    orange: {
        light: {
            primary: "oklch(0.553 0.195 38.402)",
            primaryForeground: "oklch(0.98 0.016 73.684)"
        },
        dark: {
            primary: "oklch(0.47 0.157 37.304)",
            primaryForeground: "oklch(0.98 0.016 73.684)"
        }
    },
    pink: {
        light: {
            primary: "oklch(0.525 0.223 3.958)",
            primaryForeground: "oklch(0.971 0.014 343.198)"
        },
        dark: {
            primary: "oklch(0.459 0.187 3.815)",
            primaryForeground: "oklch(0.971 0.014 343.198)"
        }
    },
    purple: {
        light: {
            primary: "oklch(0.496 0.265 301.924)",
            primaryForeground: "oklch(0.977 0.014 308.299)"
        },
        dark: {
            primary: "oklch(0.438 0.218 303.724)",
            primaryForeground: "oklch(0.977 0.014 308.299)"
        }
    },
    red: {
        light: {
            primary: "oklch(0.505 0.213 27.518)",
            primaryForeground: "oklch(0.971 0.013 17.38)"
        },
        dark: {
            primary: "oklch(0.444 0.177 26.899)",
            primaryForeground: "oklch(0.971 0.013 17.38)"
        }
    },
    rose: {
        light: {
            primary: "oklch(0.514 0.222 16.935)",
            primaryForeground: "oklch(0.969 0.015 12.422)"
        },
        dark: {
            primary: "oklch(0.455 0.188 13.697)",
            primaryForeground: "oklch(0.969 0.015 12.422)"
        }
    },
    sky: {
        light: {
            primary: "oklch(0.5 0.134 242.749)",
            primaryForeground: "oklch(0.977 0.013 236.62)"
        },
        dark: {
            primary: "oklch(0.443 0.11 240.79)",
            primaryForeground: "oklch(0.977 0.013 236.62)"
        }
    },
    teal: {
        light: {
            primary: "oklch(0.511 0.096 186.391)",
            primaryForeground: "oklch(0.984 0.014 180.72)"
        },
        dark: {
            primary: "oklch(0.437 0.078 188.216)",
            primaryForeground: "oklch(0.984 0.014 180.72)"
        }
    },
    violet: {
        light: {
            primary: "oklch(0.491 0.27 292.581)",
            primaryForeground: "oklch(0.969 0.016 293.756)"
        },
        dark: {
            primary: "oklch(0.432 0.232 292.759)",
            primaryForeground: "oklch(0.969 0.016 293.756)"
        }
    },
    yellow: {
        light: {
            primary: "oklch(0.852 0.199 91.936)",
            primaryForeground: "oklch(0.421 0.095 57.708)"
        },
        dark: {
            primary: "oklch(0.795 0.184 86.047)",
            primaryForeground: "oklch(0.421 0.095 57.708)"
        }
    }
};

/**
 * Maps public radius preset names to the CSS custom property value applied at runtime.
 * `default` is intentionally `undefined` so the stylesheet fallback remains the source of truth.
 */
export const radiusPresets: Record<RadiusPreset, string | undefined> = {
    default: undefined,
    none: "0rem",
    small: "0.375rem",
    medium: "0.625rem",
    large: "0.875rem"
};

export const themeFontFamilies = {
    inter: '"Inter Variable", sans-serif',
    geist: '"Geist Variable", sans-serif',
    manrope: '"Manrope Variable", sans-serif',
    figtree: '"Figtree Variable", sans-serif',
    "source-sans-3": '"Source Sans 3 Variable", sans-serif',
    "ibm-plex-sans": '"IBM Plex Sans Variable", sans-serif',
    lora: '"Lora Variable", serif',
    "playfair-display": '"Playfair Display Variable", serif',
    "jetbrains-mono": '"JetBrains Mono Variable", monospace'
} as const;
