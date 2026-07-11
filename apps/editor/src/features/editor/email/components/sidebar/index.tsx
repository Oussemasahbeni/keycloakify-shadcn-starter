import { Field, FieldDescription, FieldLabel } from "#/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Separator } from "#/components/ui/separator";
import { useEditor } from "#/features/editor/state/editor-context.tsx";
import { Image } from "lucide-react";

import { prettify } from "#/lib/utils";
import type { ThemePreset } from "@kc-studio/shadcn-theme/theme";
import { themePresetOptions, themePresets } from "@kc-studio/shadcn-theme/theme";

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

function LogoUrlField() {
    const { config, updateConfig } = useEditor().email;

    return (
        <Field>
            <FieldLabel>Logo URL</FieldLabel>
            <InputGroup>
                <InputGroupAddon align="inline-start">
                    <Image className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                    type="url"
                    inputMode="url"
                    value={config.logoUrl ?? ""}
                    onChange={e => updateConfig({ logoUrl: e.target.value })}
                    placeholder="https://cdn.example.com/logo.png"
                />
            </InputGroup>
            <FieldDescription>Shown at the top of every email. Leave empty to omit the logo.</FieldDescription>
        </Field>
    );
}

export function EmailThemeSidebar() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <Separator />
            <PrimaryColorField />
            <LogoUrlField />
        </div>
    );
}
