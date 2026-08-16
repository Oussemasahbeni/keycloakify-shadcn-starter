import { LOCALE_COUNT } from "#/lib/locales.ts";
import { cn } from "#/lib/utils";

import { Band, Eyebrow } from "./band";
import { OPTION_COUNTS, PRESET_SWATCHES } from "./product-facts";
import { Reveal } from "./reveal";

const STATS = [
    { value: 38, label: "Login pages", note: "Every sign-in and account screen" },
    { value: LOCALE_COUNT, label: "Languages", note: "Translated, RTL included" },
    {
        value: OPTION_COUNTS.primaryPresets,
        label: "Color presets",
        note: `Over ${OPTION_COUNTS.basePalettes} base palettes`,
        swatches: true,
    },
    {
        value: OPTION_COUNTS.fontFamilies,
        label: "Typefaces",
        note: `Across ${OPTION_COUNTS.layouts} layouts`,
    },
];

export function StatsSection() {
    return (
        <Band id="stats" className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, index) => (
                <div
                    key={stat.label}
                    className={cn(
                        index % 2 === 0 && "border-e",
                        index < 2 && "border-b lg:border-b-0",
                        "lg:border-e lg:last:border-e-0",
                    )}
                >
                    <Reveal delay={index * 0.08} className="flex h-full flex-col gap-1 p-5 sm:p-8">
                        <span className="font-mono text-3xl tabular-nums sm:text-4xl">{stat.value}</span>
                        <span className="text-sm font-medium">{stat.label}</span>
                        <Eyebrow className="mt-1 tracking-normal normal-case">{stat.note}</Eyebrow>
                        {stat.swatches && (
                            <div className="mt-2 flex flex-wrap gap-1" aria-hidden>
                                {PRESET_SWATCHES.map(swatch => (
                                    <span
                                        key={swatch.name}
                                        title={swatch.name}
                                        className="size-2.5 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/20"
                                        style={{ backgroundColor: swatch.color }}
                                    />
                                ))}
                            </div>
                        )}
                    </Reveal>
                </div>
            ))}
        </Band>
    );
}
