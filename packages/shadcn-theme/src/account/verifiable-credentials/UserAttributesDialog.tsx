/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260700.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/verifiable-credentials/UserAttributesDialog.tsx" --revert
 */

import { useTranslation } from "react-i18next";

import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";

type UserAttributesDialogProps = {
    credentialScopeName: string;
    userAttributes: Record<string, string[]>;
    onClose: () => void;
};

/** The user attributes a credential type embeds when it is issued. */
export const UserAttributesDialog = ({ credentialScopeName, userAttributes, onClose }: UserAttributesDialogProps) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open
            onOpenChange={isOpen => {
                if (!isOpen) {
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t("credentialUserAttributesFor", { credentialScopeName })}</DialogTitle>
                    <DialogDescription className="sr-only">{t("credentialUserAttributes")}</DialogDescription>
                </DialogHeader>
                <div className="rounded-(--radius) border border-border">
                    <Table aria-label={t("credentialUserAttributes")}>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("credentialAttributeName")}</TableHead>
                                <TableHead>{t("credentialAttributeValue")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(userAttributes).map(([name, values]) => (
                                <TableRow key={name}>
                                    <TableCell className="font-medium">{name}</TableCell>
                                    <TableCell className="whitespace-normal">{values.join(", ")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t("close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
