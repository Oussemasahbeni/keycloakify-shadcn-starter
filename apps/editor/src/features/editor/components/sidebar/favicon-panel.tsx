import { Button } from "#/components/ui/button.tsx";
import { Field, FieldDescription, FieldLabel } from "#/components/ui/field.tsx";
import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getFaviconError } from "../../model/favicon-upload";
import { useEditor } from "../../state/editor-context";

export function FaviconPanel() {
    const { favicon, setFavicon } = useEditor();
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!favicon) {
            setPreviewUrl(null);
            return;
        }
        const url = URL.createObjectURL(favicon);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [favicon]);

    function handleFiles(files: FileList | null) {
        const file = files?.[0];
        if (!file) return;
        const message = getFaviconError(file);
        if (message) {
            setError(message);
            return;
        }
        setError(null);
        setFavicon(file);
    }

    function clear() {
        setFavicon(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <div className="space-y-4">
            <Field>
                <FieldLabel>Favicon</FieldLabel>
                <input
                    ref={inputRef}
                    type="file"
                    accept=".png,.svg,.ico"
                    className="sr-only"
                    onChange={event => handleFiles(event.target.files)}
                />
                {favicon ? (
                    <div className="flex items-center gap-3 rounded-md border p-3">
                        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Favicon preview"
                                    className="size-full object-contain"
                                />
                            )}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{favicon.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(favicon.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remove favicon"
                            onClick={clear}
                        >
                            <X />
                        </Button>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => inputRef.current?.click()}
                    >
                        <Upload />
                        Upload favicon
                    </Button>
                )}
                {error ? (
                    <FieldDescription className="text-destructive">{error}</FieldDescription>
                ) : (
                    <FieldDescription>
                        PNG, SVG, or ICO (max 1 MB). Converted to a multi-resolution favicon and
                        baked into the exported JAR only — the live preview is unaffected.
                    </FieldDescription>
                )}
            </Field>
        </div>
    );
}
