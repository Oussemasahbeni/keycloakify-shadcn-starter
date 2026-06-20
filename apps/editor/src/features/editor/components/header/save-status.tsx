import { formatRelativeTime } from '#/lib/utils.ts';
import { useEditor } from '../../state/editor-context';

export function SaveStatus() {
    const { saveStatus, lastSavedAt } = useEditor();

    const label =
        saveStatus === "saving"
            ? "Saving…"
            : saveStatus === "error"
              ? "Save failed"
              : lastSavedAt
                ? `Saved ${formatRelativeTime(lastSavedAt)}`
                : "Not saved yet";

    return <span className="hidden text-xs text-muted-foreground sm:inline">{label}</span>;
}
