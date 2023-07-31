import { TRPCError } from '@trpc/server'
import { defaultDeadlineSelect } from './deadline.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { baseDeadlineInput, listDeadlineInput } from '~/shared/deadline'

const userIsInGroup = protectedProcedure
  .input(baseDeadlineInput)
  .use(async ({ next, ctx, input }) => {
    try {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          users: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      })

      // TODO caught locally
      if (group === null) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      return next({
        ctx: {
          group,
        },
      })
    }
    catch (err) {
      ctx.logger.error({ msg: 'failed to verify user in group', err })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list forum posts',
      })
    }
  })

export const deadlineRouter = router({
  list: userIsInGroup
    .input(listDeadlineInput)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.deadline.findMany({
          where: {
            groupId: input.groupId,
          },
          select: defaultDeadlineSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list deadlines', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list deadlines',
        })
      }
    }),
})
