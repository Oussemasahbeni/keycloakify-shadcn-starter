import { Button } from "#/components/ui/button.tsx";
import { Spinner } from "#/components/ui/spinner.tsx";
import { useServerFn } from "@tanstack/react-start";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getThemeNameError } from "../../model/theme-name";
import { generateJar } from "../../server/generate-jar";
import { useEditor } from "../../state/editor-context";

export function ExportButton() {
    const { config, themeName, favicon } = useEditor();
    const [isExporting, setIsExporting] = useState(false);
    const exportJar = useServerFn(generateJar);

    async function handleExport() {
        const nameError = getThemeNameError(themeName);
        if (nameError) {
            toast.error(`Invalid theme name: ${nameError}`);
            return;
        }

        setIsExporting(true);
        try {
            const name = themeName.trim();
            const formData = new FormData();
            formData.append("options", JSON.stringify({ config, themeName: name }));
            if (favicon) formData.append("favicon", favicon);

            const response = await exportJar({ data: formData });
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${name}.jar`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);

            toast.success(`Downloaded ${name}.jar`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Export failed.");
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <Button size="sm" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Spinner /> : <Download />}
            Export
        </Button>
    );
}
