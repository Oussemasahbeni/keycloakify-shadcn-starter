import { EditorHeader } from "#/features/editor/components/editor-header";
import { EditorSidebar } from "#/features/editor/components/editor-sidebar";
import { PreviewPane } from "#/features/editor/components/preview-pane";
import { EditorProvider } from "#/features/editor/state/editor-context";
import { enforceLogin } from "#/oidc";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editor")({
    beforeLoad: enforceLogin,
    component: EditorPage,
});

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
    );
}
