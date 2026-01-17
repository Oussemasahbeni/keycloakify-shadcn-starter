import { Languages } from "@/components/langauges";
import { ModeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirectUrlOrigin } from "@/login/shared/redirectUrlOrigin";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@radix-ui/react-tooltip";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";
import companylogo from "./../../assets/img/auth-logo.svg";
import shape from "./../../assets/img/shape.svg";
import { useInitializeTemplate } from "./useInitializeTemplate";

const APP_NAME = "Acme Inc.";

export function Template(props: {
    displayInfo?: boolean;
    displayMessage?: boolean;
    displayRequiredFields?: boolean;
    headerNode: ReactNode;
    socialProvidersNode?: ReactNode;
    infoNode?: ReactNode;
    documentTitle?: string;
    bodyClassName?: string;
    children: ReactNode;
}) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        children
    } = props;

    const { kcContext } = useKcContext();

    const { auth, url, message, isAppInitiatedAction } = kcContext;

    const { msg, msgStr, enabledLanguages } = useI18n();

    const { kcClsx } = useKcClsx();

    useEffect(() => {
        document.title =
            documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName || kcContext.realm.name);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitializeTemplate();

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="grid min-h-svh lg:grid-cols-2 bg-white dark:bg-background lg:bg-transparent">
            {/* Main content */}
            <div className="flex flex-col gap-4 px-0 py-0 pb-6 lg:p-6 lg:md:p-10 lg:pt-10 min-h-screen lg:min-h-0">
                {/*  navigation */}
                <div className="absolute top-4 right-4 lg:left-4  z-20 flex gap-2">
                    <Button type="button" variant="outline" size="icon" asChild>
                        <a href={kcContext.client.baseUrl ?? redirectUrlOrigin}>
                            <FiHome />
                        </a>
                    </Button>

                    {enabledLanguages.length > 1 && <Languages />}

                    {kcContext.darkMode !== false && <ModeToggle />}
                </div>

                {/* Mobile header with logo */}
                <div className="lg:hidden relative pt-8 px-6">
                    {/* Logo and welcome message */}
                    <div className="flex flex-col items-center justify-center gap-3 mt-4">
                        <div className=" mb-4 flex items-center gap-3">
                            <img src={companylogo} alt="Logo" />
                            <span className=" text-xl"> {APP_NAME}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 items-start lg:items-center justify-center lg:mt-0 ">
                    <div className="w-full max-w-xl ">
                        <Card className=" shadow-none bg-transparent lg:bg-card border-0 lg:rounded-lg lg:border lg:shadow-sm rounded-t-2xl">
                            <CardHeader className="text-center">
                                <CardTitle>
                                    {(() => {
                                        const node = !(
                                            auth !== undefined &&
                                            auth.showUsername &&
                                            !auth.showResetCredentials
                                        ) ? (
                                            <h1 className="text-xl">{headerNode}</h1>
                                        ) : (
                                            <div
                                                id="kc-username"
                                                className="flex items-center justify-center gap-2"
                                            >
                                                <label
                                                    className="font-semibold text-lg"
                                                    id="kc-attempted-username"
                                                >
                                                    {auth.attemptedUsername}
                                                </label>

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
                                                                    <RotateCcw className="h-4 w-4" />
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

                                        if (displayRequiredFields) {
                                            return (
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>{node}</div>
                                                    <div>
                                                        <span className="subtitle">
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                            {msg("requiredFields")}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return node;
                                    })()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent >
                                <div id="kc-content">
                                    <div id="kc-content-wrapper">
                                        {displayMessage &&
                                            message !== undefined &&
                                            (message.type !== "warning" ||
                                                !isAppInitiatedAction) && (
                                                <Alert
                                                    variant={message.type}
                                                    className="my-3"
                                                >
                                                    <AlertDescription>
                                                        <div>
                                                            <span
                                                                dangerouslySetInnerHTML={{
                                                                    __html: kcSanitize(
                                                                        message.summary
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        {socialProvidersNode}
                                        <div className="children">{children}</div>

                                        {auth !== undefined &&
                                            auth.showTryAnotherWayLink && (
                                                <form
                                                    id="kc-select-try-another-way-form"
                                                    action={url.loginAction}
                                                    method="post"
                                                >
                                                    <div
                                                        className={kcClsx(
                                                            "kcFormGroupClass"
                                                        )}
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="tryAnotherWay"
                                                            value="on"
                                                        />
                                                        <a
                                                            href="#"
                                                            id="try-another-way"
                                                            onClick={(event) => {
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
                                            <div className="text-center text-sm mt-4">
                                                {infoNode}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="bg-slate-950 relative hidden lg:block dark:bg-white/5">
                <div className="flex items-center pt-20 h-full justify-center z-1">
                    <div className="absolute right-0 top-0 w-full max-w-62.5 xl:max-w-112.5">
                        <img src={shape} alt="grid" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full max-w-62.5 rotate-180 xl:max-w-112.5">
                        <img src={shape} alt="grid" />
                    </div>

                    <div className="flex justify-center my-auto flex-col items-center max-w-xs">
                        <div className=" mb-4 flex items-center gap-3">
                            <img src={companylogo} alt="Logo" />
                            <span className="text-white text-xl"> {APP_NAME}</span>
                        </div>

                        <p className="text-center  text-gray-400 dark:text-white/60">
                            {msg("welcomeMessage")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
