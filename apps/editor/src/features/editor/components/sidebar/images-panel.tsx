import { Field, FieldLabel } from "#/components/ui/field.tsx";
import { FileUpload } from "#/components/ui/file-upload";
import { Input } from "#/components/ui/input.tsx";
import { getFaviconError } from "../../model/favicon-upload";
import { useEditor } from "../../state/editor-context";

function ImageUrlField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>
            <Input
                type="url"
                inputMode="url"
                placeholder="https://example.com/image.png"
                value={value}
                onChange={event => onChange(event.target.value)}
            />
        </Field>
    );
}

export function ImagesPanel() {
    const { config, updateConfig, favicon, setFavicon } = useEditor();

    return (
        <div className="space-y-4">
            <ImageUrlField
                label="Light logo"
                value={config.logoWhiteUrl}
                onChange={value => updateConfig({ logoWhiteUrl: value })}
            />
            <ImageUrlField
                label="Dark logo"
                value={config.logoDarkUrl}
                onChange={value => updateConfig({ logoDarkUrl: value })}
            />
            <Field>
                <FieldLabel>Favicon</FieldLabel>
                <FileUpload
                    label="Upload favicon"
                    value={favicon}
                    onChange={setFavicon}
                    accept=".png,.svg,.ico"
                    validate={file => getFaviconError(file)}
                    hint="PNG, SVG, or ICO (max 1 MB)."
                />
            </Field>

            {config.layout === "image-aside" && (
                <ImageUrlField
                    label="Side image"
                    value={config.sideImageUrl}
                    onChange={value => updateConfig({ sideImageUrl: value })}
                />
            )}
            {config.layout === "centered-card" && (
                <ImageUrlField
                    label="Background image"
                    value={config.cardBackgroundUrl}
                    onChange={value => updateConfig({ cardBackgroundUrl: value })}
                />
            )}
        </div>
    );
}
