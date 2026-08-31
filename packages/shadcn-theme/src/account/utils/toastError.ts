import type { TFunction } from "i18next";

import { toast } from "#/components/ui/toast";

import { getErrorDescription, getErrorMessage } from "../../shared/keycloak-ui-shared";
import { ApiError } from "../api/parse-response";

/**
 * Error toast for a failed account API call.
 *
 * `titleKey` may use `{{error}}` (e.g. `unLinkError`); when it does not, the error message
 * is shown as the description instead so it is never lost.
 */
export function toastApiError(t: TFunction, titleKey: string, error: unknown) {
    const message = getErrorMessage(error) ?? "";
    const title = t(titleKey, { error: message });
    const detail = error instanceof ApiError ? error.description : getErrorDescription(error);
    const description = detail || (title.includes(message) ? undefined : message);

    toast.add({ title, description, type: "error" });
}
