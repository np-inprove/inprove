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

import type { DefaultUser } from './modules/user/user.select'
import { defaultUserSelect } from './modules/user/user.select'
import type { Context } from './context'
import type { Meta } from './meta'

const t = initTRPC
  .meta<Meta>()
  .context<Context>()
  .create({
    transformer: superjson,
  })

const authMiddleware = t.middleware(async ({ next, ctx }) => {
  if (!ctx.session.data.id)
    throw new TRPCError({ code: 'UNAUTHORIZED' })

  let user = await ctx.cache.users.getItem<DefaultUser>(ctx.session.data.id)
  user ??= await ctx.prisma.user.findUnique({
    where: { id: ctx.session.data.id },
    select: defaultUserSelect,
  })

  await ctx.cache.users.setItem(ctx.session.data.id, user)

  if (user === null)
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
