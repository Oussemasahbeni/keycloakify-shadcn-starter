import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
})

const clientEnvSchema = z.object({
  VITE_OIDC_CLIENT_ID: z.string(),
  VITE_OIDC_ISSUER_URI: z.string().url(),
})

// Validate server environment
// NOTE: Module-level parse runs at module load. Fine for Node.js;
// on Cloudflare Workers (and other edge runtimes) `process.env` is
// empty at module load, so wrap this in a function and call it
// inside `.handler()` instead:
//
//   export const getServerEnv = () => envSchema.parse(process.env)
//
// Then read `getServerEnv()` per-request from server functions/middleware.
export const serverEnv = envSchema.parse(process.env)

// Validate client environment (build-time, always safe)
export const clientEnv = clientEnvSchema.parse(import.meta.env)
