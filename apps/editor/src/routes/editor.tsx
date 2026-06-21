import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "#/components/ui/resizable.tsx";
import { EditorHeader } from "#/features/editor/components/header/index.tsx";
import { PreviewPane } from "#/features/editor/components/preview/index.tsx";
import { EditorSidebar } from "#/features/editor/components/sidebar/index.tsx";
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
                <ResizablePanelGroup>
                    <ResizablePanel defaultSize="85%" minSize="30%">
                        <PreviewPane />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize="15%" minSize="15%">
                        <EditorSidebar />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </EditorProvider>
    );
}
