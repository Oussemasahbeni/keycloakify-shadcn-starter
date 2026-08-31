/** Coercions for user-profile attribute values, which Keycloak returns as `string | string[]`. */

const asString = (value: unknown) => (typeof value === "string" ? value : typeof value === "number" ? `${value}` : "");

export const toArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map(asString).filter(Boolean) : asString(value) ? [asString(value)] : [];

export const toSingle = (value: unknown): string | null => asString(Array.isArray(value) ? value[0] : value) || null;
