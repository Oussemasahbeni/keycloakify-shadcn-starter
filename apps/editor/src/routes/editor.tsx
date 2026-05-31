import { EditorProvider } from '#/features/editor/editor-context'
import { EditorHeader } from '#/features/editor/editor-header'
import { EditorSidebar } from '#/features/editor/editor-sidebar'
import { PreviewPane } from '#/features/editor/preview-pane'
import { enforceLogin } from '#/oidc'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor')({
  beforeLoad: enforceLogin,
  component: EditorPage,
})

function EditorPage() {
  return (
    <EditorProvider>
      <div className="flex h-svh flex-col">
        <EditorHeader />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <PreviewPane />
          <EditorSidebar />
        </div>
      </div>
    </EditorProvider>
  )
}
