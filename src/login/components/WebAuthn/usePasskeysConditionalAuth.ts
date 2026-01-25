import { useEffect } from "react";
import {
    useWebAuthn,
    type AuthenticateOptions,
    type WebAuthnResult
} from "./useWebAuthn";

type ConditionalAuthOptions = AuthenticateOptions & {
    enabled?: boolean;
    onSuccess: (result: WebAuthnResult) => void;
};

export function usePasskeysConditionalAuth() {
    const { authenticate } = useWebAuthn();

    const initAuthenticate = (options: ConditionalAuthOptions) => {
        const { enabled, onSuccess, errmsg, ...authOptions } = options;

        useEffect(() => {
            // Feature Flag Check
            if (!enabled) return;

            // Browser Availability Check (tryAutoFillUI logic)
            const checkAvailabilityAndRun = async () => {
                if (
                    !window.PublicKeyCredential ||
                    !PublicKeyCredential.isConditionalMediationAvailable
                ) {
                    return;
                }

                const isAvailable =
                    await PublicKeyCredential.isConditionalMediationAvailable();

                if (isAvailable) {
                    // Start Listener
                    const result = await authenticate({
                        ...authOptions,
                        mediation: "conditional",
                        errmsg
                    });

                    if (result) onSuccess(result);
                }
            };

            checkAvailabilityAndRun();
        }, []); // Runs once on mount
    };

    return { initAuthenticate };
}
