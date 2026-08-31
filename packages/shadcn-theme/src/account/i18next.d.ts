/**
 * Owned copy of the account console's i18next type augmentation (see `src/.gitignore`).
 *
 * Upstream sets `allowObjectInHTMLChildren: true`, which makes react-i18next widen
 * React's `children` type for the WHOLE package and breaks type-checking of our own
 * components. The synced Keycloak files are `@ts-nocheck`, so they do not need it.
 */

// https://www.i18next.com/overview/typescript
import "i18next";

declare module "i18next" {
    interface CustomTypeOptions {
        allowObjectInHTMLChildren: false;
    }
}
