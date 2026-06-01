import { Button } from '#/components/ui/button';
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from '#/components/ui/field';
import { Label } from '#/components/ui/label';
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '#/components/ui/select';
import { Switch } from '#/components/ui/switch';
import { Columns2, Image, Shuffle, Square, type LucideIcon } from 'lucide-react';

import { basePalettes, themePresets } from '@kc-studio/shadcn-theme/presets';
import {
    basePaletteOptions,
    fontFamilyOptions,
    layoutOptions,
    radiusPresetOptions,
    themePresetOptions,
    type BasePalette,
    type FontFamily,
    type Layout,
    type RadiusPreset,
    type ThemePreset,
} from '@kc-studio/shadcn-theme/theme-meta';
import { useEditor } from './editor-context';

function prettify(value: string) {
    return value
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function pickRandom<T>(options: readonly T[]): T {
    return options[Math.floor(Math.random() * options.length)];
}

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
    'two-column': {
        description: 'Sign-in form paired with a branded side panel.',
        Icon: Columns2,
    },
    'centered-card': {
        description: 'A single card centered on the page.',
        Icon: Square,
    },
    'image-aside': {
        description: 'Form alongside a full-height image.',
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
                        <FieldLabel key={option} htmlFor={`layout-${option}`}>
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
        <div className="flex items-center space-x-2">
            <Switch
                id="show-placeholders"
                checked={config.showPlaceholders}
                onCheckedChange={checked => updateConfig({ showPlaceholders: checked })}
            />
            <Label htmlFor="show-placeholders">Show placeholders</Label>
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
