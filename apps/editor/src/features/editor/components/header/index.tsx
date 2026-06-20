import { Logo } from "#/components/logo";

import { ModeToggle } from "#/components/mode-toggle";
import { Button } from "#/components/ui/button.tsx";
import { useEditor } from "../../state/editor-context";
import { ExportButton } from "./export-button";
import { SaveStatus } from "./save-status";
import { UserMenu } from "./user-menu";

export function EditorHeader() {
    const { themeName } = useEditor();

    return (
        <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b bg-background px-4">
            <div className="flex items-center gap-2">
                <Logo size={28} />
                <span className="font-semibold">Theme Editor</span>
            </div>

            <Button type="button" variant="ghost">
                {themeName || <span className="text-muted-foreground">my-login-theme</span>}
            </Button>

            <div className="flex items-center justify-end gap-2">
                <SaveStatus />
                <ExportButton />
                <ModeToggle />
                <UserMenu />
            </div>
        </header>
    );
}
