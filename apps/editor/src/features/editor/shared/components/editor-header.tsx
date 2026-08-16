import { Logo } from "#/components/logo";
import { ModeToggle } from "#/components/mode-toggle";

import { useEditor } from "../../state/editor-context";
import { ExportButton } from "./export-button";
import { ImportButton } from "./import-button";
import { SurfaceSwitch } from "./surface-switch";
// import { UserMenu } from "./user-menu";

export function EditorHeader() {
    const { themeName } = useEditor();

    return (
        <header className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 border-b bg-background px-4">
            <div className="flex items-center gap-2">
                <Logo size={28} />
                <span className="truncate text-muted-foreground">{themeName || "my-theme"}</span>
            </div>

            <SurfaceSwitch />

            <div className="flex items-center justify-end gap-2">
                <ImportButton />
                <ExportButton />
                <ModeToggle />
                {/* <UserMenu /> */}
            </div>
        </header>
    );
}
