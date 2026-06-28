import { useI18n } from "#/login/i18n";
import { useKcContext } from "#/login/KcContext";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import type { ReactNode } from "react";
import shape from "../../assets/img/shape.svg";
import { TemplateTopBar } from "../Template/TemplateTopBar";

export function TwoColumnLayout(props: {
    content: ReactNode;
    logoUrl: string;
    sidePanelImageUrl?: string;
    sidePanelImageDarkUrl?: string;
}) {
    const { content, logoUrl, sidePanelImageUrl, sidePanelImageDarkUrl } = props;

    const { kcContext } = useKcContext();

    const { msg } = useI18n();

    const showRealmName = kcContext.properties.SHADCN_THEME_SHOW_REALM_NAME !== "false";
    const logoAlt = kcContext.realm.displayName || kcContext.realm.name || "Logo";
    const welcomeMessage =
        kcContext.properties.SHADCN_THEME_WELCOME_MESSAGE.trim() || msg("welcomeMessage");

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative flex min-h-screen flex-col lg:min-h-0 lg:p-6 lg:pt-10">
                <TemplateTopBar />
                <div className="flex flex-1 items-center justify-center p-6 md:p-10 lg:items-center">
                    <main className="w-full max-w-xl">{content}</main>
                </div>
            </div>

            {sidePanelImageUrl || sidePanelImageDarkUrl ? (
                <div className="relative hidden h-full overflow-hidden lg:block">
                    <img
                        src={sidePanelImageUrl || sidePanelImageDarkUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover dark:hidden"
                    />

                    <img
                        src={sidePanelImageDarkUrl || sidePanelImageUrl}
                        alt=""
                        className="absolute inset-0 hidden h-full w-full object-cover dark:block"
                    />
                </div>
            ) : (
                <div className="bg-side-panel text-side-panel-foreground relative hidden h-full overflow-hidden lg:block">
                    <div className="flex h-full items-center justify-center pt-20">
                        <div className="absolute top-0 right-0 w-full max-w-62.5 xl:max-w-112.5">
                            <img src={shape} alt="" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full max-w-62.5 rotate-180 xl:max-w-112.5">
                            <img src={shape} alt="" />
                        </div>

                        <div className="relative z-10 flex max-w-xs flex-col items-center justify-center text-center">
                            <div className="mb-4 flex items-center gap-3">
                                <img
                                    src={logoUrl}
                                    alt={showRealmName ? "" : logoAlt}
                                    className="h-12 w-auto object-contain"
                                />
                                {showRealmName &&
                                    (kcContext.realm.displayNameHtml ? (
                                        <span
                                            className="text-xl"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(kcContext.realm.displayNameHtml),
                                            }}
                                        />
                                    ) : (
                                        <span className="text-xl">
                                            {kcContext.realm.displayName || kcContext.realm.name}
                                        </span>
                                    ))}
                            </div>

                            <p className="text-sm opacity-70">{welcomeMessage}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
