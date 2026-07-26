import { MAX_IMAGE_SIZE_BYTES } from "#/features/editor/shared/files.ts";
import { getImageError } from "#/features/editor/shared/validation/image.ts";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileUpload } from "./ui/file-upload";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

/**
 * One image asset in its own card, settable two ways: a URL or an uploaded file.
 * The upload wins (the server and preview both prefer the file over the URL).
 */
export function ImageAssetField({
    icon: Icon,
    hint = "PNG, SVG, or JPEG (max 1 MB).",
    accept = ".png,.svg,.jpg,.jpeg",
    validate = getImageError,
    label,
    url,
    onUrlChange,
    file,
    onFileChange,
}: {
    icon: LucideIcon;
    hint?: string;
    accept?: string;
    /** Client-side file validation. Defaults to the login image rules (allows SVG). */
    validate?: (file: File) => string | null;
    label: string;
    url: string;
    onUrlChange: (value: string) => void;
    file: File | null;
    onFileChange: (file: File | null) => void;
}) {
    return (
        <Card size="sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className="text-muted-foreground size-4" />
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <InputGroup>
                    <InputGroupInput
                        type="url"
                        inputMode="url"
                        placeholder="https://example.com/image.png"
                        value={url}
                        onChange={event => onUrlChange(event.target.value)}
                    />
                    {url && (
                        <InputGroupAddon align="inline-end">
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Clear ${label.toLowerCase()} URL`}
                                onClick={() => onUrlChange("")}
                            >
                                <X />
                            </Button>
                        </InputGroupAddon>
                    )}
                </InputGroup>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <span className="bg-border h-px flex-1" />
                    or
                    <span className="bg-border h-px flex-1" />
                </div>
                <FileUpload
                    label={`Upload ${label.toLowerCase()}`}
                    value={file}
                    onChange={onFileChange}
                    accept={accept}
                    maxSizeBytes={MAX_IMAGE_SIZE_BYTES}
                    validate={validate}
                    hint={hint}
                />
            </CardContent>
        </Card>
    );
}
