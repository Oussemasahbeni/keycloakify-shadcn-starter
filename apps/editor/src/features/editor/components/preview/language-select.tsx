import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";

import { Globe } from "lucide-react";
import type { Locale } from "../../model/locales";
import { supportedLocales } from "../../model/locales";
import { useEditor } from "../../state/editor-context";

function labelFor(locale: Locale) {
    return supportedLocales.find(entry => entry.value === locale)?.label ?? locale;
}

export function LanguageSelect() {
    const { config, updateConfig } = useEditor();

    return (
        <Select
            value={config.locale}
            onValueChange={value => updateConfig({ locale: value as Locale })}
        >
            <SelectTrigger className="w-64">
                <Globe className="text-muted-foreground size-4" />
                <SelectValue>{(selected: Locale) => labelFor(selected)}</SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="max-h-100">
                {supportedLocales.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
