import { Label } from '#/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '#/components/ui/select';
import { cn } from '#/lib/utils';

import { basePalettes, radiusPresets, themePresets } from '@kc-studio/shadcn-theme/presets';
import {
    basePaletteOptions,
    fontFamilyOptions,
    layoutOptions,
    radiusPresetOptions,
    themePresetOptions,
    type Layout,
    type RadiusPreset,
} from '@kc-studio/shadcn-theme/theme-meta';
import { useEditor } from './editor-context';

function prettify(value: string) {
    return value
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {children}
        </div>
    );
}

function Swatch({ color }: { color: string }) {
    return (
        <span className="size-4 shrink-0 rounded-full border" style={{ backgroundColor: color }} />
    );
}

/** Select with a color dot beside each option (and in the trigger). */
function ColorSelectField<T extends string>({
    label,
    value,
    options,
    colorFor,
    onChange,
}: {
    label: string;
    value: T;
    options: readonly T[];
    colorFor: (option: T) => string;
    onChange: (value: T) => void;
}) {
    return (
        <Field label={label}>
            <Select value={value} onValueChange={next => onChange(next as T)}>
                <SelectTrigger className="w-full">
                    <SelectValue>
                        {(selected: T) => (
                            <span className="flex items-center gap-2">
                                <Swatch color={colorFor(selected)} />
                                {prettify(selected)}
                            </span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                    {options.map(option => (
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

function PlainSelectField<T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: readonly T[];
    onChange: (value: T) => void;
}) {
    return (
        <Field label={label}>
            <Select value={value} onValueChange={next => onChange(next as T)}>
                <SelectTrigger className="w-full">
                    <SelectValue>{(selected: T) => prettify(selected)}</SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                    {options.map(option => (
                        <SelectItem key={option} value={option}>
                            {prettify(option)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    );
}

/** Visual tile picker — each option renders a little showcase of itself. */
function TileField<T extends string>({
    label,
    value,
    options,
    onChange,
    renderVisual,
}: {
    label: string;
    value: T;
    options: readonly T[];
    onChange: (value: T) => void;
    renderVisual: (option: T) => React.ReactNode;
}) {
    return (
        <Field label={label}>
            <div className="grid grid-cols-3 gap-2">
                {options.map(option => {
                    const isActive = option === value;
                    return (
                        <button
                            key={option}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => onChange(option)}
                            className={cn(
                                'flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-2 transition-colors hover:bg-accent',
                                isActive ? 'border-primary ring-1 ring-primary' : 'border-input',
                            )}
                        >
                            <span className="flex h-9 w-full items-center justify-center">
                                {renderVisual(option)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {prettify(option)}
                            </span>
                        </button>
                    );
                })}
            </div>
        </Field>
    );
}

function RadiusVisual({ radius }: { radius: RadiusPreset }) {
    const value = radiusPresets[radius] ?? '0.625rem';
    return (
        <span
            className="size-9 border-2 border-primary bg-primary/15"
            style={{ borderRadius: value }}
        />
    );
}

function LayoutVisual({ layout }: { layout: Layout }) {
    if (layout === 'two-column') {
        return (
            <span className="flex h-9 w-full gap-1">
                <span className="flex-1 rounded-xs bg-muted-foreground/30" />
                <span className="flex-1 rounded-xs bg-primary/40" />
            </span>
        );
    }
    if (layout === 'image-aside') {
        return (
            <span className="flex h-9 w-full gap-1">
                <span className="w-1/2 rounded-xs bg-primary/40" />
                <span className="flex w-1/2 flex-col justify-center gap-1">
                    <span className="h-1 w-full rounded-full bg-muted-foreground/30" />
                    <span className="h-1 w-3/4 rounded-full bg-muted-foreground/30" />
                    <span className="mt-0.5 h-2 w-full rounded-xs bg-primary/40" />
                </span>
            </span>
        );
    }
    // centered-card
    return (
        <span className="flex h-9 w-full items-center justify-center rounded-xs bg-muted-foreground/20">
            <span className="h-5 w-7 rounded-xs bg-primary/40" />
        </span>
    );
}

export function ConfigPanel() {
    const { config, previewColorScheme, updateConfig } = useEditor();

    return (
        <div className="space-y-5">
            <ColorSelectField
                label="Base palette"
                value={config.basePalette}
                options={basePaletteOptions}
                colorFor={palette => basePalettes[palette][previewColorScheme].mutedForeground}
                onChange={basePalette => updateConfig({ basePalette })}
            />
            <ColorSelectField
                label="Accent color"
                value={config.accent}
                options={themePresetOptions}
                colorFor={accent => themePresets[accent][previewColorScheme].primary}
                onChange={accent => updateConfig({ accent })}
            />
            <TileField
                label="Radius"
                value={config.radius}
                options={radiusPresetOptions}
                onChange={radius => updateConfig({ radius })}
                renderVisual={radius => <RadiusVisual radius={radius} />}
            />
            <PlainSelectField
                label="Font family"
                value={config.font}
                options={fontFamilyOptions}
                onChange={font => updateConfig({ font })}
            />
            <TileField
                label="Layout"
                value={config.layout}
                options={layoutOptions}
                onChange={layout => updateConfig({ layout })}
                renderVisual={layout => <LayoutVisual layout={layout} />}
            />
        </div>
    );
}
