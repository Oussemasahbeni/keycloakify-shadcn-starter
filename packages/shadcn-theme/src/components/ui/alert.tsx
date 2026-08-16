import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "#/lib/utils.ts";

const alertVariants = cva(
    "group/alert relative grid w-full gap-0.5 rounded-(--radius) border px-2.5 py-2 text-start text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pe-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                info: "bg-card text-card-foreground",
                success:
                    "bg-emerald-50/50 border-emerald-200 text-emerald-900 dark:bg-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-400",
                warning:
                    "bg-amber-50/50 border-amber-200 text-amber-900 dark:bg-amber-500/5 dark:border-amber-500/20 dark:text-amber-400",
                error: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current border-destructive/20",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    },
);

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
                className,
            )}
            {...props}
        />
    );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
                className,
            )}
            {...props}
        />
    );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="alert-action" className={cn("absolute top-2 inset-e-2", className)} {...props} />;
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
