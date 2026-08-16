import { LOCALE_COUNT } from "#/lib/locales.ts";
import { cn } from "#/lib/utils";

import { Band, Eyebrow } from "./band";
import { OPTION_COUNTS } from "./product-facts";

const STATS = [
    { value: 38, label: "Login pages", note: "Every sign-in and account screen" },
    { value: LOCALE_COUNT, label: "Languages", note: "Translated, RTL included" },
    {
        value: OPTION_COUNTS.primaryPresets,
        label: "Color presets",
        note: `Over ${OPTION_COUNTS.basePalettes} base palettes`,
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
                        "flex flex-col gap-1 p-5 sm:p-8",
                        index % 2 === 0 && "border-e",
                        index < 2 && "border-b lg:border-b-0",
                        "lg:border-e lg:last:border-e-0",
                    )}
                >
                    <span className="font-mono text-3xl tabular-nums sm:text-4xl">{stat.value}</span>
                    <span className="text-sm font-medium">{stat.label}</span>
                    <Eyebrow className="mt-1 tracking-normal normal-case">{stat.note}</Eyebrow>
                </div>
            ))}
        </Band>
    );
}
