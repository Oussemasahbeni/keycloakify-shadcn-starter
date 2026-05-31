import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { cn } from '#/lib/utils'

import { useEditor } from './editor-context'
import { themeFontFamilies } from './theme/theme-presets'
import { themeConfigToCssVars } from './theme/resolve-theme'
import { getViewportWidth } from './viewport'

/**
 * Placeholder preview surface.
 *
 * It honours the editor's `viewport` (width clamp) and `previewColorScheme`
 * (a `.dark`/`.light` class scoped to THIS container — never the document
 * root, so the app chrome keeps its own theme). When the real Keycloak pages
 * are wired in, only the inner mock is replaced (with an inline component or
 * an iframe); the width + color-scheme contract stays the same.
 */
export function PreviewPane() {
  const { viewport, previewColorScheme, config } = useEditor()
  const width = getViewportWidth(viewport)

  return (
    <div className="flex flex-1 items-start justify-center overflow-auto bg-muted/40 p-6">
      <div
        // The `previewColorScheme` class activates `dark:` variants on the
        // shadcn components inside; the inline vars override the token *values*.
        // Both are needed — see resolve-theme.ts.
        className={cn(
          previewColorScheme,
          'min-h-full w-full rounded-xl border bg-background text-foreground shadow-sm transition-[max-width] duration-300 ease-in-out',
        )}
        style={{
          ...themeConfigToCssVars(config, previewColorScheme),
          fontFamily: themeFontFamilies[config.font],
          colorScheme: previewColorScheme,
          maxWidth: width ? `${width}px` : '100%',
        }}
      >
        <div className="flex min-h-120 items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-semibold">Sign in to your account</h2>
              <p className="text-sm text-muted-foreground">
                Preview of your Keycloak login theme
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preview-username">Username or email</Label>
                <Input id="preview-username" placeholder="you@example.com" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preview-password">Password</Label>
                <Input
                  id="preview-password"
                  type="password"
                  placeholder="••••••••"
                  readOnly
                />
              </div>
              <Button className="w-full" type="button">
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
