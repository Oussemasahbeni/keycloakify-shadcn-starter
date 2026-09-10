import { Globe } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { DEFAULT_LOCALE, supportedLocales, type Locale } from "#/lib/locales.ts";

import { useEditor } from "../../state/editor-context";
import type { Surface } from "../model/surface";

function labelFor(locale: Locale) {
    return supportedLocales.find(entry => entry.value === locale)?.label ?? locale;
}

export function LanguageSelect({ surface }: { surface: Surface }) {
    const { login, email } = useEditor();
    const { config, updateConfig } = surface === "login" ? login : email;

    return (
        <Select
            value={config.locale ?? DEFAULT_LOCALE}
            onValueChange={value => updateConfig({ locale: value as Locale })}
        >
            <SelectTrigger className="w-64">
                <Globe className="size-4 text-muted-foreground" />
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
