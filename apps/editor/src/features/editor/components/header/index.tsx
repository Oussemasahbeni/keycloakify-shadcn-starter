import { Logo } from "#/components/logo";
import { ModeToggle } from "#/components/mode-toggle";
import { useEditor } from "../../state/editor-context";
import { ExportButton } from "./export-button";
import { SaveStatus } from "./save-status";
import { UserMenu } from "./user-menu";

export function EditorHeader() {
    const { themeName } = useEditor();

    return (
        <header className="bg-background grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b px-4">
            <div className="flex items-center gap-2">
                <Logo size={28} />
                <span className="font-semibold">Theme Editor</span>
            </div>

            <span>
                {themeName || <span className="text-muted-foreground">my-login-theme</span>}
            </span>

            <div className="flex items-center justify-end gap-2">
                <SaveStatus />
                <ExportButton />
                <ModeToggle />
                <UserMenu />
            </div>
        </header>
    );
}
