import { Field, FieldDescription, FieldLabel } from '#/components/ui/field.tsx';
import { Input } from '#/components/ui/input.tsx';
import { useEditor } from '../../state/editor-context';

function ImageUrlField({
    label,
    description,
    value,
    onChange,
}: {
    label: string;
    description?: string;
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
            {description && <FieldDescription>{description}</FieldDescription>}
        </Field>
    );
}


export function ImagesPanel() {
    const { config, updateConfig } = useEditor();

    return (
        <div className="space-y-4">
            <ImageUrlField
                label="Light logo"
                description="Shown on light backgrounds."
                value={config.logoWhiteUrl}
                onChange={value => updateConfig({ logoWhiteUrl: value })}
            />
            <ImageUrlField
                label="Dark logo"
                description="Shown on dark backgrounds."
                value={config.logoDarkUrl}
                onChange={value => updateConfig({ logoDarkUrl: value })}
            />
            {config.layout === "image-aside" && (
                <ImageUrlField
                    label="Side image"
                    description="Full-height image beside the form."
                    value={config.sideImageUrl}
                    onChange={value => updateConfig({ sideImageUrl: value })}
                />
            )}
            {config.layout === "centered-card" && (
                <ImageUrlField
                    label="Card background"
                    description="Background image behind the centered card."
                    value={config.cardBackgroundUrl}
                    onChange={value => updateConfig({ cardBackgroundUrl: value })}
                />
            )}
        </div>
    );
}