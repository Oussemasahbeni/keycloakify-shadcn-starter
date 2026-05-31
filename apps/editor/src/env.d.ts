/// <reference types="vite/client" />

declare global {
  // Client-side environment variables (exposed via Vite, VITE_ prefix)
  interface ImportMetaEnv {
    readonly VITE_OIDC_ISSUER_URI: string
    readonly VITE_OIDC_CLIENT_ID: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  // Server-side environment variables
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string
    }
  }
}

export {}
