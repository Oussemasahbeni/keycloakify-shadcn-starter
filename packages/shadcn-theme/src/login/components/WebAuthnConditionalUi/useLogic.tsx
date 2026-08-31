import type { KcContext } from "@keycloakify/login-ui/core/KcContext/KcContext";
import { useEffect, useRef } from "react";
import { base64url } from "rfc4648";
import { assert } from "tsafe/assert";

// see https://github.com/keycloak/keycloak/blob/main/themes/src/main/resources/theme/base/login/resources/js/webauthnAuthenticate.js

/**
 * Options required to initiate the WebAuthn authentication flow.
 * These usually come directly from the Keycloak context (kcContext).
 */
export type AuthenticateOptions = {
    /**
     * If true, the user has already entered their username.
     * We will filter the browser prompt to only show keys registered to this specific user.
     */
    isUserIdentified: boolean;

    /**
     * The random server-side challenge (Base64URL encoded string).
     * Used to prevent replay attacks.
     */
    challenge: string;

    /**
     * The relying party ID (e.g., "google.com" or "localhost").
     * Defines the scope of the credential.
     */
    rpId: string;

    /**
     * User verification requirement (e.g., "required", "preferred", "discouraged").
     * Determines if the user must enter a PIN or use biometrics.
     */
    userVerification: UserVerificationRequirement | (string & {});

    /**
     * Timeout for the interaction in seconds.
     * 0 usually means no timeout (or browser default).
     */
    createTimeout: number;

    /**
     * List of registered credentials for the user (if identified).
     * Used to create the 'allowCredentials' list.
     */
    authenticators: { credentialId: string }[] | undefined;

    /** * Mediation type for the credential request.
     * "optional" for standard button click, "conditional" for silent autofill requests,
     * "required"/"silent" as configured in the WebAuthn Passwordless Policy.
     */
    mediation: CredentialMediationRequirement;
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
          /** The DOMException name (e.g. "NotAllowedError") when the failure came from the WebAuthn API. */
          errorName?: string;
      };

let abortController: AbortController | undefined = undefined;

/**
 * sessionStorage key remembering that the user dismissed the passkey modal
 * (mediation "optional" | "required") during the current authentication session.
 * Mirrors Keycloak's passkeysConditionalAuth.js.
 */
const PASSKEY_MODAL_DISMISSED_KEY = "kc_passkey_modal_dismissed";

/** Returns the current `KC_AUTH_SESSION_HASH` cookie value, or undefined if absent. */
function getAuthSessionHash(): string | undefined {
    for (const cookie of document.cookie.split(";")) {
        const [key, value] = cookie.trim().split("=");
        if (key === "KC_AUTH_SESSION_HASH" && value) {
            return value;
        }
    }
    return undefined;
}

export type UseLogicProps = {
    isUserIdentified: "true" | "false";
    challenge: string;
    rpId: string;
    userVerification: string;
    createTimeout: string | number;
    mediation?: string;
    authenticatorAttachment?: string;
    authenticators: KcContext.WebauthnAuthenticate.WebauthnAuthenticator[] | undefined;
    loginAction: string;
};

export function useLogic(props: UseLogicProps) {
    const {
        isUserIdentified,
        challenge,
        rpId,
        userVerification,
        createTimeout,
        authenticators,
        mediation,
        authenticatorAttachment,
    } = props;

    const webAuthnFormRef = useRef<HTMLFormElement>(null);
    const submitWebAuthn = (result: WebAuthnResult) => {
        const form = webAuthnFormRef.current;
        assert(form !== null);

        const getInput = (name: string) => {
            const input = form.elements.namedItem(name);
            assert(input instanceof HTMLInputElement, `Missing hidden input: ${name}`);
            return input;
        };

        if (result.success) {
            getInput("clientDataJSON").value = result.clientDataJSON;
            getInput("authenticatorData").value = result.authenticatorData;
            getInput("signature").value = result.signature;
            getInput("credentialId").value = result.credentialId;
            getInput("userHandle").value = result.userHandle;
        } else {
            getInput("error").value = result.error;
        }

        // Forward the "remember me" choice from the login form (when rendered) along with the assertion.
        const rememberMe = document.getElementById("rememberMe");
        if (rememberMe !== null) {
            // Our Checkbox is a Radix button (role="checkbox"), not a native input, so fall back to aria-checked.
            const isChecked =
                rememberMe instanceof HTMLInputElement
                    ? rememberMe.checked
                    : rememberMe.getAttribute("aria-checked") === "true";

            const rememberMeInput = document.createElement("input");
            rememberMeInput.type = "hidden";
            rememberMeInput.name = "rememberMe";
            rememberMeInput.value = isChecked ? "on" : "off";
            form.appendChild(rememberMeInput);
        }

        form.submit();
    };

    const authOptions = {
        isUserIdentified: isUserIdentified === "true",
        challenge: challenge,
        userVerification: userVerification,
        rpId: rpId,
        createTimeout: typeof createTimeout === "string" ? Number(createTimeout) : createTimeout,
        authenticators: authenticators,
    };

    const onPasskeyDoAuthenticateClick = async () => {
        const result = await authenticate({
            ...authOptions,
            mediation: "optional",
        });
        if (result) submitWebAuthn(result);
    };

    /**
     * Automatic passkey prompt on page load. Mirrors Keycloak's passkeysConditionalAuth.js.
     *
     * Calls navigator.credentials.get() once with the mediation configured in the
     * WebAuthn Passwordless Policy. For "none", unsupported browsers, or an already
     * identified user nothing is attempted — the user can always click the button.
     *
     * For modal mediations ("optional" | "required") the dialog is shown at most once
     * per authentication session: if dismissed, it will not reappear on subsequent
     * page loads (e.g. after a failed password attempt).
     */
    useEffect(() => {
        let cancelled = false;

        void (async () => {
            if (!window.PublicKeyCredential) return;

            const autoMediation = (mediation ?? "conditional") as CredentialMediationRequirement | "none";

            if (isUserIdentified === "true" || autoMediation === "none") return;

            if (
                authenticatorAttachment === "platform" &&
                !(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
            ) {
                return;
            }

            // The isConditionalMediationAvailable() check is only relevant for
            // conditional (autofill) mediation — other modes do not depend on it.
            if (autoMediation === "conditional") {
                if (typeof PublicKeyCredential.isConditionalMediationAvailable === "undefined") return;
                if (!(await PublicKeyCredential.isConditionalMediationAvailable())) return;
            }

            const isModalMediation = autoMediation === "optional" || autoMediation === "required";
            const authSessionHash = getAuthSessionHash();

            // Skip the modal if the user already dismissed it in this authentication session.
            if (
                isModalMediation &&
                (authSessionHash === undefined ||
                    authSessionHash === sessionStorage.getItem(PASSKEY_MODAL_DISMISSED_KEY))
            ) {
                return;
            }

            const result = await authenticate({
                ...authOptions,
                mediation: autoMediation,
            });

            if (cancelled) return;

            if (result?.success) {
                submitWebAuthn(result);
                return;
            }

            // The user explicitly dismissed the modal (NotAllowedError, or AbortError as null):
            // remember it so it is not shown again during the same authentication session.
            if (
                isModalMediation &&
                authSessionHash !== undefined &&
                (result === null || result.errorName === "NotAllowedError")
            ) {
                sessionStorage.setItem(PASSKEY_MODAL_DISMISSED_KEY, authSessionHash);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        webAuthnFormRef,
        onPasskeyDoAuthenticateClick,
    };
}

export async function authenticate(options: AuthenticateOptions): Promise<WebAuthnResult | null> {
    const { isUserIdentified, challenge, rpId, userVerification, createTimeout, authenticators, mediation } = options;

    //  Browser Support Check
    if (!window.PublicKeyCredential) {
        return { success: false, error: "WebAuthnUnsupportedBrowser" };
    }

    // Prepare Configuration
    const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(base64url.parse(challenge, { loose: true })),
        rpId: rpId,
    };

    // Only set userVerification if it's a valid value
    if (userVerification && userVerification !== "not specified") {
        publicKey.userVerification = userVerification as UserVerificationRequirement;
    }

    if (createTimeout !== 0) publicKey.timeout = createTimeout * 1000;

    // Handle Allowed Credentials
    if (isUserIdentified && authenticators) {
        publicKey.allowCredentials = authenticators.map(auth => ({
            id: new Uint8Array(base64url.parse(auth.credentialId, { loose: true })),
            type: "public-key",
        }));
    }

    try {
        const credential = (await navigator.credentials.get({
            publicKey,
            signal: getWebAuthnSignal(),
            mediation,
        })) as PublicKeyCredential;

        const response = credential.response as AuthenticatorAssertionResponse;

        // Success Handling
        return {
            success: true,
            clientDataJSON: base64url.stringify(new Uint8Array(response.clientDataJSON), {
                pad: false,
            }),
            authenticatorData: base64url.stringify(new Uint8Array(response.authenticatorData), {
                pad: false,
            }),
            signature: base64url.stringify(new Uint8Array(response.signature), {
                pad: false,
            }),
            credentialId: credential.id,
            userHandle: response.userHandle
                ? base64url.stringify(new Uint8Array(response.userHandle), {
                      pad: false,
                  })
                : "",
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.name === "AbortError") return null;
        return {
            success: false,
            // Keep the DOMException name in the posted string ("NotAllowedError: ...") — the server
            // classifies the error by matching on it (see keycloak/keycloak#50654).
            error: String(error),
            errorName: typeof error.name === "string" ? error.name : undefined,
        };
    }
}

/**
 * Get an abort signal for the current WebAuthn operation.
 * Automatically aborts any previous pending WebAuthn request.
 *
 * @returns AbortSignal for use with navigator.credentials.get()
 */
export function getWebAuthnSignal(): AbortSignal {
    if (abortController) {
        // Abort the previous call
        const abortError = new Error("Cancelling pending WebAuthn call");
        abortError.name = "AbortError";
        abortController.abort(abortError);
    }

    abortController = new AbortController();
    return abortController.signal;
}
