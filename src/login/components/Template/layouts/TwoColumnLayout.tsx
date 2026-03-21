import { useI18n } from '@/login/i18n';
import { useKcContext } from '@/login/KcContext';
import { kcSanitize } from '@keycloakify/login-ui/kcSanitize';
import type { ReactNode } from "react";
import shape from "../../../assets/img/shape.svg";
import { TemplateTopBar } from '../TemplateTopBar';


export function TwoColumnLayout(props: {
    content: ReactNode;
    appLogo: string;
}) {
    const { content, appLogo } = props;

    const { kcContext } = useKcContext();

    const { msg } = useI18n();


    return (
        <div className="grid min-h-svh lg:grid-cols-2 ">
            <div className="relative flex min-h-screen flex-col pb-6 lg:min-h-0 lg:p-6 lg:pt-10">
                <TemplateTopBar />

                <div className="flex flex-1 items-center justify-center lg:items-center p-6 md:p-10">
                    <div className="w-full max-w-xl">{content}</div>
                </div>
            </div>

            <div className="bg-slate-950  relative hidden h-full overflow-hidden lg:block dark:bg-card">
                <div className="flex h-full items-center justify-center pt-20">
                    <div className="absolute right-0 top-0 w-full max-w-62.5 xl:max-w-112.5">
                        <img src={shape} alt="" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full max-w-62.5 rotate-180 xl:max-w-112.5">
                        <img src={shape} alt="" />
                    </div>

                    <div className="relative z-10 flex max-w-xs flex-col items-center justify-center text-center">
                        <div className="mb-4 flex items-center gap-3">
                            <img src={appLogo} alt="Logo" className='size-14' />
                            {kcContext.realm.displayNameHtml ? (
                                <span
                                    className="text-xl text-whit"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(kcContext.realm.displayNameHtml)
                                    }}
                                />
                            ) : (
                                <span className="text-xl text-whit">{kcContext.realm.displayName || kcContext.realm.name}</span>
                            )}
                        </div>

                        <p className="text-sm text-white/70">{msg("welcomeMessage")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
