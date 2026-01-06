import { cn } from '@/components/lib/utils';
import { Button } from "@/components/ui/button";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { clsx } from "@keycloakify/login-ui/tools/clsx";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { assert } from "tsafe/assert";
import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";
import useProviderLogos from "./useProviderLogos";

/** To use this component make sure that kcContext.social exists */
export function SocialProviders() {
    const { kcContext } = useKcContext();

    assert("social" in kcContext && kcContext.social !== undefined);

    const providerLogos = useProviderLogos();

    const { msg } = useI18n();

    const { kcClsx } = useKcClsx();

    if (
        kcContext.social.providers === undefined ||
        kcContext.social.providers.length === 0
    ) {
        return null;
    }

    return (
        <div
            id="kc-social-providers"
            className={kcClsx("kcFormSocialAccountSectionClass")}
        >
            <div className="mt-4 flex items-center text-sm">
                <div className="mt-px flex-auto border-t"></div>
                <div className="text-muted-foreground mx-2">
                    {msg("identity-provider-login-label")}
                </div>
                <div className="mt-px flex-auto border-t"></div>
            </div>
            <ul
                className={`mt-4! grid gap-3 sm:grid-cols-1 ${(kcContext.social?.providers?.length ?? 0) > 3 ? "sm:grid-cols-2" : ""}`}
            >
                {kcContext.social.providers.map((...[p, , providers]) => (
                    <li key={p.alias}>
                        <Button variant="outline" className="w-full hover:text-current" asChild>
                            <a
                                id={`social-${p.alias}`}
                                className={clsx(
                                    kcClsx(
                                        providers.length > 3 &&
                                        "kcFormSocialAccountGridItem"
                                    ),
                                    "flex items-center justify-center gap-3 "
                                )}
                                href={p.loginUrl}
                            >
                                <div className={"h-5 w-5"}>
                                    {providerLogos[p.alias] ? (
                                        <img
                                            src={providerLogos[p.alias]}
                                            alt={`${p.displayName} logo`}
                                            className={cn(
                                                "h-full w-auto",
                                                // Invert specific icons in dark mode
                                                (p.alias === "github" || p.alias === "x" || p.alias === "twitter") && "dark:invert"
                                            )}
                                        />
                                    ) : (
                                        // Fallback to the original iconClasses if the logo is not defined
                                        p.iconClasses && (
                                            <i
                                                className={clsx(
                                                    kcClsx("kcCommonLogoIdP"),
                                                    p.iconClasses,
                                                    `text-provider-${p.alias}`
                                                )}
                                                aria-hidden="true"
                                            ></i>
                                        )
                                    )}
                                </div>

                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(p.displayName)
                                    }}
                                ></span>
                            </a>
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
