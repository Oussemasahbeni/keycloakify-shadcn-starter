import { EmailPreviewIframe } from "#/features/editor/email/preview/preview-iframe.tsx";
import { EmailThemeSidebar } from "#/features/editor/email/sidebar";
import { EditorSurface } from "#/features/editor/shared/components/editor-surface.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/editor/email")({
    component: EmailEditor,
});

function EmailEditor() {
    return <EditorSurface Preview={EmailPreviewIframe} Sidebar={EmailThemeSidebar} />;
}
