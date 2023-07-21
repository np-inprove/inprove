import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '~/server/trpc/trpc'

export const meRouter = router({
  get: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.session.user
    }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: {
            name: input.name,
          },
        })
        await ctx.cache.users.setItem(ctx.session.user.id, user)
        return user
      }
      catch (err) {
        ctx.logger.error('error updating user', { err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error updating user',
          cause: err,
        })
      }
    }),
})
