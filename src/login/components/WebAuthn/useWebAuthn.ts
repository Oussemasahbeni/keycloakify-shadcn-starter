import { useCallback, useRef } from "react";
import { base64url } from "rfc4648";

// see https://github.com/keycloak/keycloak/blob/main/themes/src/main/resources/theme/base/login/resources/js/webauthnAuthenticate.js

/**
 * Options required to initiate the WebAuthn authentication flow.
 * These usually come directly from the Keycloak context (kcContext).
 */
export type AuthenticateOptions = {
    /** * If true, the user has already entered their username.
     * We will filter the browser prompt to only show keys registered to this specific user.
     */
    isUserIdentified: boolean;

    /** * The random server-side challenge (Base64URL encoded string).
     * Used to prevent replay attacks.
     */
    challenge: string;

    /** * The relying party ID (e.g., "google.com" or "localhost").
     * Defines the scope of the credential.
     */
    rpId: string;

    /** * User verification requirement (e.g., "required", "preferred", "discouraged").
     * Determines if the user must enter a PIN or use biometrics.
     */
    userVerification: UserVerificationRequirement | string;

    /** * Timeout for the interaction in seconds.
     * 0 usually means no timeout (or browser default).
     */
    createTimeout: number;

    /** * List of registered credentials for the user (if identified).
     * Used to create the 'allowCredentials' list.
     */
    authenticators?: { credentialId: string }[];

    /** * Mediation type for the credential request.
     * "optional" for standard button click, "conditional" for silent requests.
     */
    mediation?: "optional" | "conditional";

    /** * Optional error message to display if the browser does not support WebAuthn.
     */
    errmsg?: string;
};

/**
 * The structure of the successful authentication result.
 * All binary fields are converted to Base64URL strings for form submission.
 */
export type WebAuthnResult =
    | {
          success: true;
          clientDataJSON: string;
          authenticatorData: string;
          signature: string;
          credentialId: string;
          userHandle: string;
      }
    | {
          success: false;
          error: string;
      };

export function useWebAuthn() {
    const abortControllerRef = useRef<AbortController | null>(null);

    const authenticate = useCallback(
        async (options: AuthenticateOptions): Promise<WebAuthnResult | null> => {
            const {
                isUserIdentified,
                challenge,
                rpId,
                userVerification,
                createTimeout,
                authenticators,
                errmsg,
                mediation = "optional"
            } = options;

            //  Browser Support Check
            if (!window.PublicKeyCredential) {
                return { success: false, error: errmsg || "WebAuthn not supported" };
            }

            //  Abort Controller
            if (abortControllerRef.current) {
                abortControllerRef.current.abort(
                    new Error("Cancelling pending WebAuthn call")
                );
            }
            abortControllerRef.current = new AbortController();

            // Prepare Configuration
            const publicKey: PublicKeyCredentialRequestOptions = {
                challenge: new Uint8Array(base64url.parse(challenge, { loose: true })),
                rpId: rpId
            };

            // Only set userVerification if it's a valid value
            if (userVerification && userVerification !== "not specified") {
                publicKey.userVerification =
                    userVerification as UserVerificationRequirement;
            }

            if (createTimeout !== 0) publicKey.timeout = createTimeout * 1000;

            // Handle Allowed Credentials
            if (isUserIdentified && authenticators) {
                publicKey.allowCredentials = authenticators.map(auth => ({
                    id: new Uint8Array(
                        base64url.parse(auth.credentialId, { loose: true })
                    ),
                    type: "public-key"
                }));
            }

            try {
                const credential = (await navigator.credentials.get({
                    publicKey,
                    signal: abortControllerRef.current.signal,
                    mediation
                })) as PublicKeyCredential;

                const response = credential.response as AuthenticatorAssertionResponse;

                // Success Handling
                return {
                    success: true,
                    clientDataJSON: base64url.stringify(
                        new Uint8Array(response.clientDataJSON),
                        { pad: false }
                    ),
                    authenticatorData: base64url.stringify(
                        new Uint8Array(response.authenticatorData),
                        { pad: false }
                    ),
                    signature: base64url.stringify(new Uint8Array(response.signature), {
                        pad: false
                    }),
                    credentialId: credential.id,
                    userHandle: response.userHandle
                        ? base64url.stringify(new Uint8Array(response.userHandle), {
                              pad: false
                          })
                        : ""
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log("WebAuthn error", error);
                if (error.name === "AbortError") return null;
                return {
                    success: false,
                    error: error.message || "Unknown WebAuthn error"
                };
            }
        },
        []
    );

    return { authenticate };
}
