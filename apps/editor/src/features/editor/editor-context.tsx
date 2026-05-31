import { createContext, useContext, useState } from 'react'

import type { Viewport } from './viewport'
import { defaultThemeConfig  } from './theme/resolve-theme'
import type {ThemeConfig} from './theme/resolve-theme';

export type PreviewColorScheme = 'light' | 'dark'

/** Persistence status. Inert until the token-editing + autosave unit lands. */
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type EditorContextValue = {
  viewport: Viewport
  setViewport: (viewport: Viewport) => void
  previewColorScheme: PreviewColorScheme
  setPreviewColorScheme: (scheme: PreviewColorScheme) => void
  togglePreviewColorScheme: () => void
  config: ThemeConfig
  updateConfig: (patch: Partial<ThemeConfig>) => void
  saveStatus: SaveStatus
  lastSavedAt: Date | null
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [previewColorScheme, setPreviewColorScheme] =
    useState<PreviewColorScheme>('light')
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig)

  const value: EditorContextValue = {
    viewport,
    setViewport,
    previewColorScheme,
    setPreviewColorScheme,
    togglePreviewColorScheme: () =>
      setPreviewColorScheme((scheme) =>
        scheme === 'light' ? 'dark' : 'light',
      ),
    config,
    updateConfig: (patch) => setConfig((current) => ({ ...current, ...patch })),
    // Wired in the persistence unit; inert defaults for now.
    saveStatus: 'idle',
    lastSavedAt: null,
  }

  return <EditorContext value={value}>{children}</EditorContext>
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (context === null) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
