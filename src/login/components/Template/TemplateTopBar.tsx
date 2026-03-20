import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/login/components/ui/ThemeToggle";
import { redirectUrlOrigin } from "@/login/shared/redirectUrlOrigin";
import { FiHome } from "react-icons/fi";
import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";
import { Languages } from "../ui/Langauges";

export function TemplateTopBar() {
    const { kcContext } = useKcContext();
    const { enabledLanguages } = useI18n();

    return (
        <div className="absolute inset-x-4 top-4 z-20 flex items-center gap-2">
            <Button type="button" variant="outline" size="icon" asChild>
                <a href={kcContext.client?.baseUrl ?? redirectUrlOrigin} aria-label="Home">
                    <FiHome />
                </a>
            </Button>

            {kcContext.darkMode !== false && <ModeToggle />}

            {enabledLanguages.length > 1 && <Languages />}
        </div>
    );
}
