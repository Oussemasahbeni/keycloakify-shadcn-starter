import { Button } from "#/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import { Switch } from "#/components/ui/switch";
import type { LucideIcon } from "lucide-react";
import { Columns2, Image, Shuffle, Square } from "lucide-react";

import { pickRandom, prettify } from "#/lib/utils";
import { basePalettes, themePresets } from "@kc-studio/shadcn-theme/theme";
import type {
    BasePalette,
    FontFamily,
    Layout,
    RadiusPreset,
    ThemePreset,
} from "@kc-studio/shadcn-theme/theme";
import {
    basePaletteOptions,
    fontFamilyOptions,
    layoutOptions,
    radiusPresetOptions,
    themePresetOptions,
} from "@kc-studio/shadcn-theme/theme";
import { useEditor } from "../state/editor-context";

function Swatch({ color }: { color: string }) {
    return (
        <span className="size-4 shrink-0 rounded-full border" style={{ backgroundColor: color }} />
    );
}

function BasePaletteField() {
    const { config, previewColorScheme, updateConfig } = useEditor();
    const colorFor = (palette: BasePalette) =>
        basePalettes[palette][previewColorScheme].mutedForeground;

    return (
        <Field>
            <FieldLabel>Base palette</FieldLabel>
            <Select
                value={config.basePalette}
                onValueChange={value => updateConfig({ basePalette: value as BasePalette })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue>
                        {(selected: BasePalette) => (
                            <span className="flex items-center gap-2">
                                <Swatch color={colorFor(selected)} />
                                {prettify(selected)}
                            </span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                    {basePaletteOptions.map(option => (
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

function AccentColorField() {
    const { config, previewColorScheme, updateConfig } = useEditor();
    const colorFor = (accent: ThemePreset) => themePresets[accent][previewColorScheme].primary;

    return (
        <Field>
            <FieldLabel>Accent color</FieldLabel>
            <Select
                value={config.accent}
                onValueChange={value => updateConfig({ accent: value as ThemePreset })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue>
                        {(selected: ThemePreset) => (
                            <span className="flex items-center gap-2">
                                <Swatch color={colorFor(selected)} />
                                {prettify(selected)}
                            </span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
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

function RadiusField() {
    const { config, updateConfig } = useEditor();

    return (
        <Field>
            <FieldLabel>Radius</FieldLabel>
            <Select
                value={config.radius}
                onValueChange={value => updateConfig({ radius: value as RadiusPreset })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue>
                        {(selected: RadiusPreset) => (
                            <span className="flex items-center gap-2">{prettify(selected)}</span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                    {radiusPresetOptions.map(option => (
                        <SelectItem key={option} value={option}>
                            <span className="flex items-center gap-2">{prettify(option)}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    );
}

function FontFamilyField() {
    const { config, updateConfig } = useEditor();

    return (
        <Field>
            <FieldLabel>Font family</FieldLabel>
            <Select
                value={config.font}
                onValueChange={value => updateConfig({ font: value as FontFamily })}
            >
                <SelectTrigger className="w-full">
                    <SelectValue>{(selected: FontFamily) => prettify(selected)}</SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                    {fontFamilyOptions.map(option => (
                        <SelectItem key={option} value={option}>
                            {prettify(option)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    );
}

const layoutMeta: Record<Layout, { description: string; Icon: LucideIcon }> = {
    "two-column": {
        description: "Sign-in form paired with a branded side panel.",
        Icon: Columns2,
    },
    "centered-card": {
        description: "A single card centered on the page.",
        Icon: Square,
    },
    "image-aside": {
        description: "Form alongside a full-height image.",
        Icon: Image,
    },
};

function LayoutField() {
    const { config, updateConfig } = useEditor();

    return (
        <Field>
            <FieldLabel>Layout</FieldLabel>
            <RadioGroup
                value={config.layout}
                onValueChange={value => updateConfig({ layout: value as Layout })}
            >
                {layoutOptions.map(option => {
                    const { description, Icon } = layoutMeta[option];
                    return (
                        <FieldLabel
                            className="hover:cursor-pointer"
                            key={option}
                            htmlFor={`layout-${option}`}
                        >
                            <Field orientation="horizontal">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/50 text-muted-foreground">
                                    <Icon className="size-4" />
                                </span>
                                <FieldContent>
                                    <FieldTitle>{prettify(option)}</FieldTitle>
                                    <FieldDescription>{description}</FieldDescription>
                                </FieldContent>
                                <RadioGroupItem value={option} id={`layout-${option}`} />
                            </Field>
                        </FieldLabel>
                    );
                })}
            </RadioGroup>
        </Field>
    );
}

function ShowPlaceholdersField() {
    const { config, updateConfig } = useEditor();

    return (
        <div className="flex items-center gap-2">
            <Switch
                id="show-placeholders"
                checked={config.showPlaceholders}
                onCheckedChange={checked => updateConfig({ showPlaceholders: checked })}
            />
            <Label htmlFor="show-placeholders">Show placeholders</Label>
        </div>
    );
}

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

function ShuffleButton() {
    const { updateConfig } = useEditor();

    function shuffle() {
        updateConfig({
            basePalette: pickRandom(basePaletteOptions),
            accent: pickRandom(themePresetOptions),
            radius: pickRandom(radiusPresetOptions),
            font: pickRandom(fontFamilyOptions),
            layout: pickRandom(layoutOptions),
            showPlaceholders: Math.random() < 0.5,
        });
    }

    return (
        <Button type="button" variant="outline" className="w-full" onClick={shuffle}>
            <Shuffle />
            Shuffle
        </Button>
    );
}

export function ConfigPanel() {
    return (
        <div className="space-y-5">
            <ShuffleButton />
            <BasePaletteField />
            <AccentColorField />
            <RadiusField />
            <FontFamilyField />
            <ShowPlaceholdersField />
            <LayoutField />
        </div>
    );
}
