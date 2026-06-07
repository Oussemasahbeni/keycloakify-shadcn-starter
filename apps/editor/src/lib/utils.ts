import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function prettify(value: string) {
    return value
        .split("-")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export function pickRandom<T>(options: readonly T[]): T {
    return options[Math.floor(Math.random() * options.length)];
}

export function getInitials(name: string) {
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join("");
    return initials.toUpperCase() || "?";
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
});
const relativeTimeDivisions: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
];

export function formatRelativeTime(date: Date) {
    let duration = (date.getTime() - Date.now()) / 1000;
    for (const [amount, unit] of relativeTimeDivisions) {
        if (Math.abs(duration) < amount) {
            return relativeTimeFormatter.format(Math.round(duration), unit);
        }
        duration /= amount;
    }
    return relativeTimeFormatter.format(Math.round(duration), "week");
}
