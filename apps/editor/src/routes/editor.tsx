import { EditorHeader } from "#/features/editor/shared/components/editor-header.tsx";
import { EditorProvider } from "#/features/editor/state/editor-context";
import { enforceLogin } from "#/oidc";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editor")({
    beforeLoad: enforceLogin,
    component: EditorLayout,
});

function EditorLayout() {
    return (
        <EditorProvider>
            <div className="flex h-svh flex-col">
                <EditorHeader />
                <Outlet />
            </div>
        </EditorProvider>
    );
}
