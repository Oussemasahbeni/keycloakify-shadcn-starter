/**
 * Resolves the %BASE_URL% token in theme asset URLs.
 *
 * Supports two forms:
 *   - Self-hosted:  "%BASE_URL%/my-logo.svg"  →  "/my-logo.svg"
 *   - External:     "https://cdn.example.com/logo.svg"  →  unchanged
 */
export function resolveAssetUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;

    return url.replace(/%BASE_URL%/g, () => {
        const base = import.meta.env.BASE_URL ?? "/";
        return base.endsWith("/") ? base.slice(0, -1) : base;
    });
}
