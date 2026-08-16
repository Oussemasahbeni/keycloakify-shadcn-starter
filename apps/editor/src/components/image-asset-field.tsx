import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

import { MAX_IMAGE_SIZE_BYTES } from "#/features/editor/shared/files.ts";
import { getImageError } from "#/features/editor/shared/validation/image.ts";

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
                    <Icon className="size-4 text-muted-foreground" />
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-px flex-1 bg-border" />
                    or
                    <span className="h-px flex-1 bg-border" />
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
