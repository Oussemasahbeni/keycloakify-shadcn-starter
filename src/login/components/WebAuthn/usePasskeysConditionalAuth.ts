import { useRef } from "react";
import {
    useWebAuthn,
    type AuthenticateOptions,
    type WebAuthnResult
} from "./useWebAuthn";

// see https://github.com/keycloak/keycloak/blob/main/themes/src/main/resources/theme/base/login/resources/js/passkeysConditionalAuth.js

type ConditionalAuthOptions = AuthenticateOptions & {
    enabled?: boolean;
    onSuccess: (result: WebAuthnResult) => void;
};

export function usePasskeysConditionalAuth() {
    const { authenticate } = useWebAuthn();
    const hasRunRef = useRef(false);

    const initAuthenticate = async (options: ConditionalAuthOptions) => {
        const { enabled, onSuccess, errmsg, ...authOptions } = options;

        // Feature Flag Check
        if (!enabled) return;

        // Prevent duplicate runs - conditional auth should only start once
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        // Browser Availability Check (tryAutoFillUI logic)
        if (
            !window.PublicKeyCredential ||
            !PublicKeyCredential.isConditionalMediationAvailable
        ) {
            return;
        }

        const isAvailable = await PublicKeyCredential.isConditionalMediationAvailable();

        if (isAvailable) {
            // Start Listener - this attaches to the input with autocomplete="username webauthn"
            const result = await authenticate({
                ...authOptions,
                mediation: "conditional",
                errmsg
            });

            if (result) onSuccess(result);
        }
    };

    return { initAuthenticate };
}
