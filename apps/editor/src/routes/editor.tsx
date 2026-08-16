import { createFileRoute } from "@tanstack/react-router";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "#/components/ui/resizable.tsx";
import { EmailPreviewIframe } from "#/features/editor/email/preview/preview-iframe.tsx";
import { EmailThemeSidebar } from "#/features/editor/email/sidebar";
import { LoginPreviewIframe } from "#/features/editor/login/preview/preview-iframe.tsx";
import { LoginThemeSidebar } from "#/features/editor/login/sidebar";
import { EditorHeader } from "#/features/editor/shared/components/editor-header.tsx";
import { EditorProvider, useEditor } from "#/features/editor/state/editor-context";

export const Route = createFileRoute("/editor")({
    component: EditorPage,
});

function EditorPage() {
    return (
        <EditorProvider>
            <EditorLayout />
        </EditorProvider>
    );
}

const SURFACES = {
    login: { Preview: LoginPreviewIframe, Sidebar: LoginThemeSidebar },
    email: { Preview: EmailPreviewIframe, Sidebar: EmailThemeSidebar },
} as const;

function EditorLayout() {
    const { activeSurface } = useEditor();
    const { Preview, Sidebar } = SURFACES[activeSurface];

    return (
        <div className="flex h-svh flex-col">
            <EditorHeader />
            <ResizablePanelGroup>
                <ResizablePanel defaultSize="80%" minSize="30%">
                    <Preview />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="20%" minSize="15%">
                    <Sidebar />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
