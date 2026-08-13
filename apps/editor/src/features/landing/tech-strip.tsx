import { KEYCLOAKIFY_URL, SHADCN_URL, TAILWIND_URL } from "#/config/constants.ts";
import { cn } from "#/lib/utils";
import { SiKeycloak, SiReact, SiShadcnui, SiTailwindcss, SiTypescript, SiVite } from "@icons-pack/react-simple-icons";
import { Band, Eyebrow } from "./band";

const STACK = [
    { name: "Keycloakify", url: KEYCLOAKIFY_URL, Icon: SiKeycloak },
    { name: "shadcn/ui", url: SHADCN_URL, Icon: SiShadcnui },
    { name: "Tailwind v4", url: TAILWIND_URL, Icon: SiTailwindcss },
    { name: "React 19", url: "https://react.dev", Icon: SiReact },
    { name: "TypeScript", url: "https://www.typescriptlang.org", Icon: SiTypescript },
    { name: "Vite", url: "https://vite.dev", Icon: SiVite },
];

export function TechStrip() {
    return (
        <Band>
            <div className="px-5 pt-8 pb-5 text-center sm:px-10">
                <Eyebrow>Built on</Eyebrow>
            </div>

            {/* The grid is 2 / 3 / 6 columns, so which cell sits on the band's own
                rules changes per breakpoint — each border is zeroed where the cell
                is the last of its row or column to avoid doubled rules. */}
            <ul className="grid grid-cols-2 border-t sm:grid-cols-3 lg:grid-cols-6">
                {STACK.map(({ name, url, Icon }, index) => (
                    <li
                        key={name}
                        className={cn(
                            index % 2 === 0 ? "border-e" : "border-e-0",
                            index % 3 === 2 ? "sm:border-e-0" : "sm:border-e",
                            index === STACK.length - 1 ? "lg:border-e-0" : "lg:border-e",
                            index < 4 ? "border-b" : "border-b-0",
                            index < 3 ? "sm:border-b" : "sm:border-b-0",
                            "lg:border-b-0",
                        )}
                    >
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group hover:bg-muted/40 flex h-full flex-col items-center gap-2 px-4 py-6 transition-colors duration-200"
                        >
                            <Icon className="text-muted-foreground group-hover:text-foreground size-5 transition-colors duration-200" />
                            <span className="text-sm font-medium">{name}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </Band>
    );
}
