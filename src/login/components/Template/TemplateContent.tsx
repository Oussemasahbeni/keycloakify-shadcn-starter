import { cn } from "@/components/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { RotateCcw, User } from "lucide-react";
import { type ReactNode } from "react";
import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";
import type { TemplateProps } from "./Template";


type TemplateContentProps = TemplateProps & {
    appWhiteModeLogo: string;
    appDarkModeLogo: string;
    cardClassName?: string;
    brandingVisibilityClassName?: string;
};

export function TemplateContent(props: TemplateContentProps) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        children,
        appWhiteModeLogo,
        appDarkModeLogo,
        cardClassName,
        brandingVisibilityClassName
    } = props;

    const { kcContext } = useKcContext();
    const { auth, url, message, isAppInitiatedAction, realm } = kcContext;
    const { msg, msgStr } = useI18n();
    const { kcClsx } = useKcClsx();


    const titleNode: ReactNode =
        !(
            auth !== undefined &&
            auth.showUsername &&
            !auth.showResetCredentials
        ) ? (
            <h1 className="text-xl">{headerNode}</h1>
        ) : (
            <div
                id="kc-username"
                className="flex items-center justify-between gap-2"
            >
                <div className="flex gap-4 items-center">
                    <User className="text-muted-foreground size-6" />

                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-normal text-muted-foreground">
                            {msgStr("attemptedUsernameLoggingInAs")}
                        </span>
                        <label
                            className="font-semibold text-lg"
                            id="kc-attempted-username"
                        >
                            {auth.attemptedUsername}
                        </label>
                    </div>
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                asChild
                            >
                                <a
                                    id="reset-login"
                                    href={
                                        url.loginRestartFlowUrl
                                    }
                                    aria-label={msgStr(
                                        "restartLoginTooltip"
                                    )}
                                >
                                    <RotateCcw className="size-4" />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {msg(
                                    "restartLoginTooltip"
                                )}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );

    return (
        <Card className={cardClassName}>
            <CardHeader >
                <div
                    className={cn(
                        "flex flex-col items-center justify-center gap-3",
                        brandingVisibilityClassName
                    )}
                >
                    <div className="flex items-center gap-3 mb-4 ">
                        <img src={appWhiteModeLogo} alt="Logo" className='size-14 dark:hidden' />
                        <img src={appDarkModeLogo} alt="Logo" className='size-14 hidden dark:inline-block' />
                        {realm.displayNameHtml ? (
                            <span
                                className="text-xl"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(realm.displayNameHtml)
                                }}
                            />
                        ) : (
                            <span className="text-xl">{realm.displayName || realm.name}</span>
                        )}
                    </div>
                </div>

                <CardTitle>
                    {displayRequiredFields ? (
                        <div className="flex items-center justify-between gap-2">
                            <div>{titleNode}</div>
                            <div>
                                <span className="subtitle">
                                    <span className="text-red-500">*</span>
                                    {msg("requiredFields")}
                                </span>
                            </div>
                        </div>
                    ) : (
                        titleNode
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div id="kc-content" className="flex flex-col gap-4">
                    {displayMessage &&
                        message !== undefined &&
                        (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert variant={message.type}>
                                <AlertDescription>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(message.summary)
                                        }}
                                    />
                                </AlertDescription>
                            </Alert>
                        )}

                    {socialProvidersNode}
                    {children}

                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form
                            id="kc-select-try-another-way-form"
                            action={url.loginAction}
                            method="post"
                        >
                            <div className={kcClsx("kcFormGroupClass")}>
                                <input
                                    type="hidden"
                                    name="tryAnotherWay"
                                    value="on"
                                />
                                <a
                                    href="#"
                                    id="try-another-way"
                                    onClick={event => {
                                        document.forms[
                                            "kc-select-try-another-way-form" as never
                                        ].submit();
                                        event.preventDefault();
                                        return false;
                                    }}
                                >
                                    {msg("doTryAnotherWay")}
                                </a>
                            </div>
                        </form>
                    )}

                    {displayInfo && (
                        <div className="text-center text-sm">{infoNode}</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
