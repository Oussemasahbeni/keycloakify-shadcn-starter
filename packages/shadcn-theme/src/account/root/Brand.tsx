import { cn } from "#/lib/utils";

import { useBrand } from "./useBrand";

type BrandProps = {
    alt: string;
    className?: string;
};

export function Brand({ alt, className }: BrandProps) {
    const { logo, logoDark } = useBrand();
    const hasDarkLogo = logoDark !== logo;

    return (
        <>
            <img src={logo} alt={alt} className={cn("h-7 w-auto", hasDarkLogo && "dark:hidden", className)} />
            {hasDarkLogo && <img src={logoDark} alt={alt} className={cn("hidden h-7 w-auto dark:block", className)} />}
        </>
    );
}
