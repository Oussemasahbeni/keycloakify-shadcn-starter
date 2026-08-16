import type { ReactNode } from "react";

import { TemplateTopBar } from "../Template/TemplateTopBar";

export function CenteredCardLayout(props: { content: ReactNode; backgroundUrl?: string }) {
    const { content, backgroundUrl } = props;

    return (
        <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            {backgroundUrl && (
                <>
                    <img src={backgroundUrl} alt="Background" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-background/50 dark:bg-background/80" />
                </>
            )}
            <TemplateTopBar />
            <main className="relative z-10 w-full max-w-xl">{content}</main>
        </div>
    );
}
