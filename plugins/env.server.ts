/**
 * General note when defining schemas:
 * - Since Nuxt runtime config is passed, default options should be specified in nuxt.config.ts
 * - This means none of the values should use `.optional()`
 */

import { z } from 'zod'
import { createConsola } from 'consola'

const log = createConsola()

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const client = z.object({
  public: z.object({
    appName: z.string(),
  }),
})

const resendSchema = z.object({
  resend: z.object({
    apiKey: z.string(),
    fromAddress: z.union([
      z.string().email(),
      z.string().length(0),
    ]),
  }),
})

const axiomSchema = z.object({
  axiom: z.object({
    dataset: z.string(),
    token: z.string(),
  }),
})

const redisSchema = z.object({
  redis: z.object({
    enabled: z.boolean(),
    host: z.string(),
    port: z.number(),
    username: z.string(),
    password: z.string(),
  }),
})

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z
  .object({
    databaseUrl: z.string().url(),
    otpExpiry: z.coerce.number().positive(),
    sessionSecret: z.string().min(32),
    sessionName: z.string(),
    admins: z.string().transform(value => value.split(';')).pipe(z.string().array()),
  })
  // Add on schemas as needed that requires conditional validation.
  .merge(resendSchema)
  .merge(axiomSchema)
  .merge(redisSchema)
  .merge(client)
  .refine(val => !(val.resend.apiKey && !val.resend.fromAddress), {
    message: 'resend.fromAddress is required when resend.apiKey is set',
    path: ['resend.fromAddress'],
  })
  .refine(val => !(val.redis.enabled && !(val.redis.host && val.redis.port)), {
    message: 'redis.host and redis.port are required when redis.enabled is true',
    path: ['redis.host', 'redis.port'],
  })

let init = false
export default defineNuxtPlugin(() => {
  if (init)
    return

  const config = useRuntimeConfig()

  if (config.skipEnvValidation) {
    log.info('skipping env validation')
    return
  }

  log.info('running env validation')

  const parsed = server.safeParse(config)
  if (!parsed.success) {
    log.error('invalid environment variables: \n', parsed.error.flatten().fieldErrors)
    return
  }

  log.info('passed env validation')
  init = true
})
