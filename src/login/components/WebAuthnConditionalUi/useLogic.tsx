import { useEffect, useRef } from "react";
import { base64url } from "rfc4648";
import { assert } from "tsafe/assert";
import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";


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
    userVerification: UserVerificationRequirement | string;

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
     * "optional" for standard button click, "conditional" for silent requests.
     */
    mediation: "optional" | "conditional";

    /** * Optional error message to display if the browser does not support WebAuthn.
     */
    errmsg: string | undefined;
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


let abortController: AbortController | undefined = undefined;

export function useLogic() {
    const { kcContext } = useKcContext();
    assert("enableWebAuthnConditionalUI" in kcContext);

    const { msgStr } = useI18n();

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

        form.submit();
    };

    const authOptions = {
        isUserIdentified: kcContext.isUserIdentified === "true",
        challenge: kcContext.challenge,
        userVerification: kcContext.userVerification,
        rpId: kcContext.rpId,
        createTimeout:
            typeof kcContext.createTimeout === "string"
                ? Number(kcContext.createTimeout)
                : kcContext.createTimeout,
        authenticators: kcContext.authenticators?.authenticators
    };

    const onPasskeyDoAuthenticateClick = async () => {
        const result = await authenticate({
            ...authOptions,
            mediation: "optional",
            errmsg: msgStr("webauthn-unsupported-browser-text")
        });
        if (result) submitWebAuthn(result);
    };

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (
                !window.PublicKeyCredential ||
                !PublicKeyCredential.isConditionalMediationAvailable
            )
                return;

            const isAvailable =
                await PublicKeyCredential.isConditionalMediationAvailable();
            if (!isAvailable) return;

            const result = await authenticate({
                ...authOptions,
                mediation: "conditional",
                errmsg: msgStr("passkey-unsupported-browser-text")
            });

            if (cancelled) return;
            if (result) submitWebAuthn(result);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        webAuthnFormRef,
        onPasskeyDoAuthenticateClick
    };
}


export async function authenticate(
    options: AuthenticateOptions
): Promise<WebAuthnResult | null> {
    const {
        isUserIdentified,
        challenge,
        rpId,
        userVerification,
        createTimeout,
        authenticators,
        errmsg,
        mediation
    } = options;

    //  Browser Support Check
    if (!window.PublicKeyCredential) {
        return { success: false, error: errmsg || "WebAuthn not supported" };
    }

    // Prepare Configuration
    const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(base64url.parse(challenge, { loose: true })),
        rpId: rpId
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
            type: "public-key"
        }));
    }

    try {
        const credential = (await navigator.credentials.get({
            publicKey,
            signal: getWebAuthnSignal(),
            mediation
        })) as PublicKeyCredential;

        const response = credential.response as AuthenticatorAssertionResponse;

        // Success Handling
        return {
            success: true,
            clientDataJSON: base64url.stringify(new Uint8Array(response.clientDataJSON), {
                pad: false
            }),
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
        if (error.name === "AbortError") return null;
        return {
            success: false,
            error: error.message || "Unknown WebAuthn error"
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
