import { ImageAssetField } from "#/components/image-asset-field.tsx";
import { Field, FieldLabel } from "#/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Separator } from "#/components/ui/separator";
import { useEditor } from "#/features/editor/state/editor-context.tsx";

import { prettify } from "#/lib/utils";
import type { ThemePreset } from "@kc-studio/shadcn-theme/theme";
import { themePresetOptions, themePresets } from "@kc-studio/shadcn-theme/theme";
import { Mail } from "lucide-react";

function Swatch({ color }: { color: string }) {
    return <span className="size-4 shrink-0 rounded-full border" style={{ backgroundColor: color }} />;
}

// Sentinel Select value for "inherit the login accent" (config.primaryPreset
// is `undefined` in that case, which a controlled Select can't represent).
const INHERIT = "__inherit__";

function PrimaryColorField() {
    const { email, login } = useEditor();
    const { config, updateConfig } = email;
    const colorFor = (accent: ThemePreset) => themePresets[accent].light.primary;

    return (
        <Field>
            <FieldLabel>Accent color</FieldLabel>
            <Select
                value={config.primaryPreset ?? INHERIT}
                onValueChange={value =>
                    updateConfig({
                        primaryPreset: value === INHERIT ? undefined : (value as ThemePreset),
                    })
                }
            >
                <SelectTrigger className="w-full">
                    <SelectValue>
                        {(selected: ThemePreset | typeof INHERIT) => {
                            const accent = selected === INHERIT ? login.config.accent : selected;
                            return (
                                <span className="flex items-center gap-2">
                                    <Swatch color={colorFor(accent)} />
                                    {selected === INHERIT ? `Match login (${prettify(accent)})` : prettify(accent)}
                                </span>
                            );
                        }}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                    <SelectItem value={INHERIT}>
                        <span className="flex items-center gap-2">
                            <Swatch color={colorFor(login.config.accent)} />
                            Match login ({prettify(login.config.accent)})
                        </span>
                    </SelectItem>
                    {themePresetOptions.map(option => (
                        <SelectItem key={option} value={option}>
                            <span className="flex items-center gap-2">
                                <Swatch color={colorFor(option)} />
                                {prettify(option)}
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    );
}

function EmailLogoUrlField() {
    const { config, updateConfig, emailLogoFile, setEmailLogoFile } = useEditor().email;

    return (
        <ImageAssetField
            accept=".png,.jpg,.jpeg"
            hint="PNG or JPEG (max 1 MB)."
            icon={Mail}
            label="Email logo"
            url={config.logoUrl ?? ""}
            onUrlChange={value => updateConfig({ logoUrl: value })}
            file={emailLogoFile}
            onFileChange={file => setEmailLogoFile(file)}
        />
    );
}

export function EmailThemeSidebar() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <Separator />
            <PrimaryColorField />
            <EmailLogoUrlField />
        </div>
    );
}
