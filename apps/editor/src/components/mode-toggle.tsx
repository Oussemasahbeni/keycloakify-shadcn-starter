import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    useEffect(() => {
        const cycleTheme = (e: KeyboardEvent) => {
            if (
                (e.key === "d" || e.key === "D") &&
                !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName) &&
                !(e.target as HTMLElement).isContentEditable
            ) {
                setTheme(theme === "light" ? "dark" : "light");
                e.preventDefault();
            }
        };
        window.addEventListener("keydown", cycleTheme);
        return () => window.removeEventListener("keydown", cycleTheme);
    }, [theme, setTheme]);

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
