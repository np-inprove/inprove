/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'

import { defaultUserSelect } from './modules/user/user.select'
import type { Context } from './context'
import type { Meta } from './meta'

const t = initTRPC
  .meta<Meta>()
  .context<Context>()
  .create({
    transformer: superjson,
  })

const authMiddleware = t.middleware(async ({ next, ctx, meta }) => {
  if (!ctx.session.data.id)
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.data.id },
    select: defaultUserSelect,
  })

  if (user === null)
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  if (meta?.admin && !user.admin)
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  // If user is logged in, replace original session data with user session.
  // Modifying session data is usually not done.
  return next({
    ctx: {
      session: {
        user,
      },
    },
  })
})

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure

/**
 * Create a protected procedure
 **/
export const protectedProcedure = t.procedure
  .use(authMiddleware)

export const router = t.router
export const middleware = t.middleware
