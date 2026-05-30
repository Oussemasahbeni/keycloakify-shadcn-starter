import { buttonVariants } from "#/components/ui/button";
import { redirectUrlOrigin } from "#/lib/redirectUrlOrigin";
import { cn } from "#/lib/utils.ts";
import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { FiHome } from "react-icons/fi";
import { Languages } from "../ui/Langauges";
import { ModeToggle } from "../ui/ThemeToggle";

export function TemplateTopBar() {
    const { kcContext } = useKcContext();
    const { enabledLanguages } = useI18n();

    return (
        <div className="absolute inset-x-4 top-4 z-20 flex items-center gap-2">
            <a
                href={kcContext.client?.baseUrl ?? redirectUrlOrigin}
                aria-label="Home"
                className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
            >
                <FiHome />
            </a>

            {kcContext.darkMode !== false && <ModeToggle />}

            {enabledLanguages.length > 1 && <Languages />}
        </div>
    );
}
