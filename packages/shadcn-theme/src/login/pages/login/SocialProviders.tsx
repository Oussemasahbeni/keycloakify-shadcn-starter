import { buttonVariants } from "#/components/ui/button";
import { cn } from "#/lib/utils";
import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { clsx } from "@keycloakify/login-ui/tools/clsx";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { useState } from "react";
import { assert } from "tsafe/assert";
import useProviderLogos from "./useProviderLogos";

const LAST_PROVIDER_KEY = "lastSocialProvider";

export function SocialProviders() {
    const { kcContext } = useKcContext();

    assert("social" in kcContext && kcContext.social !== undefined);

    const providerLogos = useProviderLogos();
    const { msg } = useI18n();
    const { kcClsx } = useKcClsx();

    const [lastProvider] = useState(() => localStorage.getItem(LAST_PROVIDER_KEY));

    if (kcContext.social.providers === undefined || kcContext.social.providers.length === 0) {
        return null;
    }

    return (
        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
            <ul
                className={`grid gap-3 ${kcContext.social.providers.length > 1 ? "sm:grid-cols-2" : ""}`}
            >
                {kcContext.social.providers.map((...[p]) => (
                    <li key={p.alias}>
                        <div className="relative">
                            <a
                                id={`social-${p.alias}`}
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "flex items-center justify-center gap-3 w-full hover:text-current",
                                )}
                                href={p.loginUrl}
                                onClick={() => localStorage.setItem(LAST_PROVIDER_KEY, p.alias)}
                            >
                                {providerLogos[p.alias] ? (
                                    <div className="size-5">
                                        <img
                                            src={providerLogos[p.alias]}
                                            alt={`${p.displayName} logo`}
                                            className={cn(
                                                "h-full w-auto",
                                                // Invert specific icons in dark mode
                                                (p.alias === "github" ||
                                                    p.alias === "x" ||
                                                    p.alias === "twitter") &&
                                                    "dark:invert",
                                            )}
                                        />
                                    </div>
                                ) : (
                                    // Fallback to the original iconClasses if the logo is not defined
                                    p.iconClasses && (
                                        <i
                                            className={clsx(
                                                kcClsx("kcCommonLogoIdP"),
                                                p.iconClasses,
                                                `text-provider-${p.alias}`,
                                            )}
                                            aria-hidden="true"
                                        ></i>
                                    )
                                )}

                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(p.displayName),
                                    }}
                                ></span>
                            </a>
                            {lastProvider === p.alias && (
                                <span className="absolute -top-2 -inset-e-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                    {msg("identity-provider-login-last-used")}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="py-4 flex items-center text-sm">
                <div className="mt-px flex-auto border-t"></div>
                <div className="text-muted-foreground mx-2">
                    {msg("identity-provider-login-label")}
                </div>
                <div className="mt-px flex-auto border-t"></div>
            </div>
        </div>
    );
}
