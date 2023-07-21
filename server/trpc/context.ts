import type { PrismaClient } from '@prisma/client'
import type { Logger } from 'pino'
import type { inferAsyncReturnType } from '@trpc/server'
import type { H3Event, SessionConfig, SessionData } from 'h3'
import type { Storage } from 'unstorage'
import type { Resend } from 'resend'
import type { UserSessionData } from '~/shared/session'

/**
 * H3 session types
 */

type SessionDataT = Record<string, any>
type SessionUpdate<T extends SessionDataT = SessionDataT> = Partial<SessionData<T>> | ((oldData: SessionData<T>) => Partial<SessionData<T>> | undefined)

interface UseSessionReturn<T extends SessionDataT = SessionDataT> {
  readonly id: string | undefined
  readonly data: T
  update: (update: SessionUpdate<T>) => Promise<any>
  clear: () => Promise<any>
}

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
interface CreateInnerContextOptions {
  logger: Logger

  // Cache
  cache: {
    users: Storage
  }

  // Auth
  session: UseSessionReturn<UserSessionData>

  // External services
  prisma: PrismaClient
  resend: Resend
}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Most things should be passed in through H3 event context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export function createContextInner(opts: CreateInnerContextOptions) {
  return opts
}

/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext(_event: H3Event) {
  const config: SessionConfig = {
    name: useRuntimeConfig().sessionName,
    password: useRuntimeConfig().sessionSecret,
  }

  const contextInner = createContextInner({
    logger: _event.context.logger,
    cache: _event.context.cache,
    session: await useSession(_event, config),
    prisma: _event.context.prisma,
    resend: _event.context.resend,
  })

  return {
    ...contextInner,
    // Other outer context values as needed
  }
}

export type Context = inferAsyncReturnType<typeof createContextInner>
