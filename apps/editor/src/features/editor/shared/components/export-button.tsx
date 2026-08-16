import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download } from "lucide-react";

import { Button } from "#/components/ui/button.tsx";
import { Spinner } from "#/components/ui/spinner.tsx";
import { toast } from "@/components/ui/toast";

import { generateJar } from "../../server/generate-jar";
import { useEditor } from "../../state/editor-context";
import { assetDefinitions } from "../model/assets";
import { getThemeNameError } from "../validation/theme-name";

export function ExportButton() {
    const {
        themeName,
        login: { config, assets },
        email: { config: emailConfig, emailLogoFile },
    } = useEditor();
    const exportJar = useServerFn(generateJar);

    const { mutate: exportTheme, isPending } = useMutation({
        mutationFn: async () => {
            const name = themeName.trim();
            const formData = new FormData();

            formData.append("options", JSON.stringify({ login: config, email: emailConfig, themeName: name }));

            for (const { key } of assetDefinitions) {
                const file = assets[key];
                if (file) formData.append(key, file);
            }
            // Favicon is upload-only and baked via its own multi-file pipeline.
            if (assets.favicon) formData.append("favicon", assets.favicon);

            if (emailLogoFile) formData.append("emailLogoFile", emailLogoFile);

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
            toast.add({
                description: `Downloaded ${name}.jar`,
                type: "success",
            });
        },
        onError: error =>
            toast.add({
                description: error instanceof Error ? error.message : "Export failed.",
                type: "error",
            }),
    });

    function handleExport() {
        const nameError = getThemeNameError(themeName);
        if (nameError)
            return toast.add({
                description: `Invalid theme name: ${nameError}`,
                type: "error",
            });
        exportTheme();
    }

    return (
        <Button size="sm" onClick={handleExport} disabled={isPending}>
            {isPending ? <Spinner /> : <Download />}
            Export
        </Button>
    );
}
