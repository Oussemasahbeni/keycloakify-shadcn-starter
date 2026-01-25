import { useCallback } from "react";
import { base64url } from "rfc4648";

// Types based on what Keycloak passes to the script
export type RegisterOptions = {
    challenge: string;
    rpId: string;
    rpEntityName: string;
    userid: string;
    username: string;
    signatureAlgorithms: string[];
    attestationConveyancePreference?: string;
    authenticatorAttachment?: string;
    requireResidentKey?: string; // 'Yes' | 'No' | 'not specified'
    userVerificationRequirement?: string;
    createTimeout: number;
    excludeCredentialIds?: string; // Comma-separated string
    errmsg?: string;
};

export type WebAuthnRegisterResult =
    | {
          success: true;
          clientDataJSON: string;
          attestationObject: string;
          publicKeyCredentialId: string;
          transports: string;
      }
    | { success: false; error: string };

export function useWebAuthnRegister() {
    const register = useCallback(
        async (options: RegisterOptions): Promise<WebAuthnRegisterResult> => {
            const {
                challenge,
                rpId,
                rpEntityName,
                userid,
                username,
                signatureAlgorithms,
                attestationConveyancePreference,
                authenticatorAttachment,
                requireResidentKey,
                userVerificationRequirement,
                createTimeout,
                excludeCredentialIds,
                errmsg
            } = options;

            if (!window.PublicKeyCredential) {
                return { success: false, error: errmsg || "WebAuthn not supported" };
            }

            // Build Public Key Options
            const publicKey: PublicKeyCredentialCreationOptions = {
                challenge: new Uint8Array(base64url.parse(challenge, { loose: true })),
                rp: { id: rpId, name: rpEntityName },
                user: {
                    id: new Uint8Array(base64url.parse(userid, { loose: true })),
                    name: username,
                    displayName: username
                },
                pubKeyCredParams: [],
                timeout: createTimeout !== 0 ? createTimeout * 1000 : undefined,
                excludeCredentials: []
            };

            // Map Algorithms
            if (signatureAlgorithms.length === 0) {
                publicKey.pubKeyCredParams.push({ type: "public-key", alg: -7 });
            } else {
                signatureAlgorithms.forEach(alg => {
                    publicKey.pubKeyCredParams.push({
                        type: "public-key",
                        alg: Number(alg)
                    });
                });
            }

            // Authenticator Selection
            const authSelect: AuthenticatorSelectionCriteria = {};
            let isAuthSelectSpecified = false;

            if (authenticatorAttachment && authenticatorAttachment !== "not specified") {
                authSelect.authenticatorAttachment =
                    authenticatorAttachment as AuthenticatorAttachment;
                isAuthSelectSpecified = true;
            }

            if (requireResidentKey && requireResidentKey !== "not specified") {
                authSelect.requireResidentKey = requireResidentKey === "Yes";
                isAuthSelectSpecified = true;
            }

            if (
                userVerificationRequirement &&
                userVerificationRequirement !== "not specified"
            ) {
                authSelect.userVerification =
                    userVerificationRequirement as UserVerificationRequirement;
                isAuthSelectSpecified = true;
            }

            if (isAuthSelectSpecified) {
                publicKey.authenticatorSelection = authSelect;
            }

            // Attestation
            if (
                attestationConveyancePreference &&
                attestationConveyancePreference !== "not specified"
            ) {
                publicKey.attestation =
                    attestationConveyancePreference as AttestationConveyancePreference;
            }

            // Exclude Credentials (prevent registering the same key twice)
            if (excludeCredentialIds) {
                const ids = excludeCredentialIds.split(",").filter(id => id !== "");
                publicKey.excludeCredentials = ids.map(id => ({
                    type: "public-key",
                    id: new Uint8Array(base64url.parse(id, { loose: true }))
                }));
            }

            try {
                // Call Browser API
                const credential = (await navigator.credentials.create({
                    publicKey
                })) as PublicKeyCredential;

                // Type Narrowing & Formatting
                if (!(credential instanceof PublicKeyCredential)) {
                    throw new Error("Created credential is not a PublicKeyCredential");
                }

                const response = credential.response;
                if (!(response instanceof AuthenticatorAttestationResponse)) {
                    throw new Error(
                        "Response is not an AuthenticatorAttestationResponse"
                    );
                }

                // Handle Transports
                let transports = "";
                if (typeof response.getTransports === "function") {
                    const transportsList = response.getTransports();
                    if (transportsList && Array.isArray(transportsList)) {
                        transports = transportsList.join(",");
                    }
                }

                // Success
                return {
                    success: true,
                    clientDataJSON: base64url.stringify(
                        new Uint8Array(response.clientDataJSON),
                        { pad: false }
                    ),
                    attestationObject: base64url.stringify(
                        new Uint8Array(response.attestationObject),
                        { pad: false }
                    ),
                    publicKeyCredentialId: base64url.stringify(
                        new Uint8Array(credential.rawId),
                        { pad: false }
                    ),
                    transports
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                return { success: false, error: error.message || "Registration failed" };
            }
        },
        []
    );

    return { register };
}
