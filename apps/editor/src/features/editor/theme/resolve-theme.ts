import type { CSSProperties } from 'react'

import { basePalettes, radiusPresets, themePresets } from './theme-presets'
import type {
  BasePalette,
  FontFamily,
  Layout,
  RadiusPreset,
  ThemePreset,
  ThemeTokens,
} from './theme-types'

import type { PreviewColorScheme } from '../editor-context'

/** The user-editable theme document driven by the Config tab. */
export type ThemeConfig = {
  basePalette: BasePalette
  accent: ThemePreset
  radius: RadiusPreset
  font: FontFamily
  layout: Layout
}

/** Defaults match the current `styles.css` (neutral surfaces + purple primary). */
export const defaultThemeConfig: ThemeConfig = {
  basePalette: 'neutral',
  accent: 'purple',
  radius: 'default',
  font: 'geist',
  layout: 'centered-card',
}

/** Merge the base palette's surfaces with the accent preset's primary tokens. */
export function resolveThemeTokens(
  config: ThemeConfig,
  mode: PreviewColorScheme,
): ThemeTokens {
  return {
    ...basePalettes[config.basePalette][mode],
    ...themePresets[config.accent][mode],
  }
}

function camelToKebab(value: string) {
  return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

/**
 * Resolved tokens as inline CSS custom properties (`--background`, `--primary`,
 * `--card-foreground`, …). These map onto Tailwind's `--color-*` tokens, which
 * reference `var(--*)` in `@theme inline`, so overriding them at runtime
 * re-themes everything inside the container.
 *
 * Note: `--radius` is only set when the preset overrides the default; `default`
 * is omitted so the stylesheet fallback wins. Font is NOT set here — `--font-sans`
 * is a literal in `@theme inline` and cannot be overridden via a CSS var, so the
 * preview applies `fontFamily` directly.
 */
export function themeConfigToCssVars(
  config: ThemeConfig,
  mode: PreviewColorScheme,
): CSSProperties {
  const tokens = resolveThemeTokens(config, mode)
  const vars: Record<string, string> = {}

  for (const [key, value] of Object.entries(tokens)) {
    vars[`--${camelToKebab(key)}`] = value
  }

  const radius = radiusPresets[config.radius]
  if (radius !== undefined) {
    vars['--radius'] = radius
  }

  return vars
}
