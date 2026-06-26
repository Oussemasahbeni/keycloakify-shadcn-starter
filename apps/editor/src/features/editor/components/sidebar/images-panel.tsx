import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card.tsx";
import { FileUpload } from "#/components/ui/file-upload";
import { Input } from "#/components/ui/input.tsx";
import type { LucideIcon } from "lucide-react";
import { Image as ImageIcon, Moon, PanelLeft, Star, Sun } from "lucide-react";
import { MAX_IMAGE_SIZE_BYTES, getImageError, imageAssets } from "../../model/assets";
import { getFaviconError } from "../../model/favicon-upload";
import { useEditor } from "../../state/editor-context";

const ASSET_ICONS: Record<string, LucideIcon> = {
    favicon: Star,
    logoWhiteUrl: Sun,
    logoDarkUrl: Moon,
    sideImageUrl: PanelLeft,
    cardBackgroundUrl: ImageIcon,
};

/**
 * One image asset in its own card, settable two ways: a URL or an uploaded file.
 * The upload wins (the server and preview both prefer the file over the URL).
 */
function ImageAssetField({
    icon: Icon,
    label,
    url,
    onUrlChange,
    file,
    onFileChange,
}: {
    icon: LucideIcon;
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
                <CardDescription>
                    Paste an image URL or upload a file. An uploaded file overrides the URL.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Input
                    type="url"
                    inputMode="url"
                    placeholder="https://example.com/image.png"
                    value={url}
                    onChange={event => onUrlChange(event.target.value)}
                />
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <span className="bg-border h-px flex-1" />
                    or
                    <span className="bg-border h-px flex-1" />
                </div>
                <FileUpload
                    label={`Upload ${label.toLowerCase()}`}
                    value={file}
                    onChange={onFileChange}
                    accept=".png,.svg,.jpg,.jpeg"
                    maxSizeBytes={MAX_IMAGE_SIZE_BYTES}
                    validate={getImageError}
                    hint="PNG, SVG, or JPEG (max 1 MB)."
                />
            </CardContent>
        </Card>
    );
}

export function ImagesPanel() {
    const { config, updateConfig, files, setFiles } = useEditor();

    return (
        <div className="space-y-4">
            <Card size="sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="text-muted-foreground size-4" />
                        Favicon
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <FileUpload
                        label="Upload favicon"
                        value={files.favicon}
                        onChange={file => setFiles({ ...files, favicon: file })}
                        accept=".png,.svg,.ico"
                        validate={getFaviconError}
                        hint="PNG, SVG, or ICO (max 1 MB)."
                    />
                </CardContent>
            </Card>

            {imageAssets
                .filter(asset => !("layout" in asset) || asset.layout === config.layout)
                .map(asset => (
                    <ImageAssetField
                        key={asset.key}
                        icon={ASSET_ICONS[asset.key] ?? ImageIcon}
                        label={asset.label}
                        url={config[asset.key]}
                        onUrlChange={value => updateConfig({ [asset.key]: value })}
                        file={files[asset.key]}
                        onFileChange={file => setFiles({ ...files, [asset.key]: file })}
                    />
                ))}
        </div>
    );
}
