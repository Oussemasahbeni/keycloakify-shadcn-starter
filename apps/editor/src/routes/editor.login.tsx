import { LoginPreviewIframe } from "#/features/editor/login/preview/preview-iframe.tsx";
import { LoginThemeSidebar } from "#/features/editor/login/sidebar";
import { EditorSurface } from "#/features/editor/shared/components/editor-surface.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editor/login")({
    component: LoginEditor,
});

function LoginEditor() {
    return <EditorSurface Preview={LoginPreviewIframe} Sidebar={LoginThemeSidebar} />;
}
