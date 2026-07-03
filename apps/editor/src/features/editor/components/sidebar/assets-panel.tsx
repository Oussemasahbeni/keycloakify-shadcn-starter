import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { FileUpload } from "#/components/ui/file-upload";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import type { LucideIcon } from "lucide-react";
import { Image as ImageIcon, Moon, PanelLeft, Star, Sun, X } from "lucide-react";
import type { ThemeAssetKey } from "../../model/assets";
import { MAX_IMAGE_SIZE_BYTES, assetDefinitions, getImageError } from "../../model/assets";
import { getFaviconError } from "../../model/favicon-upload";
import { useEditor } from "../../state/editor-context";

const ASSET_ICONS: Record<ThemeAssetKey, LucideIcon> = {
    favicon: Star,
    logoUrl: Sun,
    logoDarkUrl: Moon,
    asideImageUrl: PanelLeft,
    cardImageUrl: ImageIcon,
    sidePanelImageUrl: PanelLeft,
    sidePanelImageDarkUrl: Moon,
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
                            <Button variant="ghost" size="icon" onClick={() => onUrlChange("")}>
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
                    accept=".png,.svg,.jpg,.jpeg"
                    maxSizeBytes={MAX_IMAGE_SIZE_BYTES}
                    validate={getImageError}
                    hint="PNG, SVG, or JPEG (max 1 MB)."
                />
            </CardContent>
        </Card>
    );
}

export function AssetsPanel() {
    const { config, updateConfig, assets, setAssets } = useEditor();

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
                        value={assets.favicon}
                        onChange={file => setAssets({ ...assets, favicon: file })}
                        accept=".png,.svg,.ico"
                        validate={getFaviconError}
                        hint="PNG, SVG, or ICO (max 1 MB)."
                    />
                </CardContent>
            </Card>

            {assetDefinitions
                .filter(asset => !("layout" in asset) || asset.layout === config.layout)
                .map(asset => (
                    <ImageAssetField
                        key={asset.key}
                        icon={ASSET_ICONS[asset.key]}
                        label={asset.label}
                        url={config[asset.key]}
                        onUrlChange={value => updateConfig({ [asset.key]: value })}
                        file={assets[asset.key]}
                        onFileChange={file => setAssets({ ...assets, [asset.key]: file })}
                    />
                ))}
        </div>
    );
}
