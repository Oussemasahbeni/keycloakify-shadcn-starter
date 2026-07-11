import { Button } from "#/components/ui/button.tsx";
import { Spinner } from "#/components/ui/spinner.tsx";
import { useServerFn } from "@tanstack/react-start";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { assetDefinitions } from "../../login/model/assets";
import { getThemeNameError } from "../../login/model/theme-name";
import { generateJar } from "../../server/generate-jar";
import { useEditor } from "../../state/editor-context";

import { useMutation } from "@tanstack/react-query";

export function ExportButton() {
    const {
        themeName,
        login: { config, assets },
        email: { config: emailConfig },
    } = useEditor();
    const exportJar = useServerFn(generateJar);

    const { mutate: exportTheme, isPending } = useMutation({
        mutationFn: async () => {
            const name = themeName.trim();
            const formData = new FormData();
            const email = {
                primaryPreset: emailConfig.primaryPreset,
                logoUrl: emailConfig.logoUrl,
            };
            formData.append("options", JSON.stringify({ config, email, themeName: name }));

            for (const { key } of assetDefinitions) {
                const file = assets[key];
                if (file) formData.append(key, file);
            }
            // Favicon is upload-only and baked via its own multi-file pipeline.
            if (assets.favicon) formData.append("favicon", assets.favicon);

            const response = await exportJar({ data: formData });
            return { blob: await response.blob(), name };
        },
        onSuccess: ({ blob, name }) => {
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `${name}.jar`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);
            toast.success(`Downloaded ${name}.jar`);
        },
        onError: error => toast.error(error instanceof Error ? error.message : "Export failed."),
    });
    function handleExport() {
        const nameError = getThemeNameError(themeName);
        if (nameError) return toast.error(`Invalid theme name: ${nameError}`);
        exportTheme();
    }

    return (
        <Button size="sm" onClick={handleExport} disabled={isPending}>
            {isPending ? <Spinner /> : <Download />}
            Export
        </Button>
    );
}
