/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260700.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/FormErrorText.tsx" --revert
 */

import type { ComponentProps } from "react";

import { FieldError } from "#/components/ui/field";

export type FormErrorTextProps = Omit<ComponentProps<typeof FieldError>, "children" | "errors"> & {
    message: string;
};

/** Field-level error line (server validation or react-hook-form). */
export const FormErrorText = ({ message, ...props }: FormErrorTextProps) => (
    <FieldError {...props}>{message}</FieldError>
);
