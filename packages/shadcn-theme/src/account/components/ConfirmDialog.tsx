import type { ReactElement, ReactNode } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "#/components/ui/alert-dialog";

type ConfirmDialogProps = {
    trigger: ReactElement;
    label: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel: ReactNode;
    cancelLabel: ReactNode;
    onConfirm: () => void | Promise<void>;
    destructive?: boolean;
    children?: ReactNode;
};

export function ConfirmDialog({
    trigger,
    label,
    title,
    description,
    confirmLabel,
    cancelLabel,
    onConfirm,
    destructive,
    children,
}: ConfirmDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger render={trigger}>{label}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        variant={destructive ? "destructive" : "default"}
                        onClick={() => void onConfirm()}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
