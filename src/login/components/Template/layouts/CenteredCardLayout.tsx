import type { ReactNode } from "react";
import { TemplateTopBar } from "../TemplateTopBar";

export function CenteredCardLayout(props: { content: ReactNode }) {
    const { content } = props;

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <TemplateTopBar />
            <main className="w-full max-w-lg">{content}</main>
        </div>
    );
}
