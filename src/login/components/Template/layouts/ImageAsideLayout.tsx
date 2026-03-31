import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from "react";
import placeholder from "../../../assets/img/placeholder.svg";
import { TemplateTopBar } from '../TemplateTopBar';


export function ImageAsideLayout(props: {
    content: ReactNode;
    imageUrl?: string;
}) {
    const { content, imageUrl } = props;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <TemplateTopBar />
            <Card className="overflow-hidden p-0 w-full max-w-sm md:max-w-4xl">
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <div className="min-w-0">{content}</div>
                    <div className="relative hidden md:block h-full min-h-80 bg-muted">
                        <img
                            src={imageUrl || placeholder}
                            alt="Authentication visual"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.35] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
