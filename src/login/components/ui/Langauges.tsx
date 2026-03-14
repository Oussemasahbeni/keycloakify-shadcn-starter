import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/login/i18n";
import { IoCheckmark, IoLanguage } from "react-icons/io5";
import { Button } from "../../../components/ui/button";

export function Languages() {
    const { msgStr, currentLanguage, enabledLanguages } = useI18n();

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        aria-label={msgStr("languages")}
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="language-switch1"
                    >
                        <IoLanguage />
                        {currentLanguage.label}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    id="language-switch1"
                    role="menu"
                    className="max-h-72 overflow-y-auto"
                >
                    {enabledLanguages.map(({ languageTag, label, href }, i) => {
                        const isActive = languageTag === currentLanguage.languageTag;

                        return (
                            <DropdownMenuItem key={languageTag} asChild>
                                <a
                                    role="menuitem"
                                    id={`language-${i + 1}`}
                                    href={href}
                                    className="flex w-full items-center justify-between  cursor-pointer"
                                >
                                    {label}
                                    {isActive && (
                                        <IoCheckmark className="h-4 w-4 opacity-50" />
                                    )}
                                </a>
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
