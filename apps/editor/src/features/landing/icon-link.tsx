import type { ReactNode } from "react";

import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";

/** External link styled as a ghost icon button. Shared by the header and footer. */
export function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
        >
            {children}
        </a>
    );
}
