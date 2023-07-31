import { TRPCError } from '@trpc/server'
import { defaultDeadlineSelect } from './deadline.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { baseDeadlineInput, createDeadlineInput, listDeadlineInput, updateDeadlineInput, upvoteDeadlineInput } from '~/shared/deadline'

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

  create: userIsInGroup
    .input(createDeadlineInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.deadline.create({
          data: {
            name: input.name,
            dueDate: input.dueDate,
            groupId: input.groupId,
            authorId: ctx.session.user.id,
          },
          select: defaultDeadlineSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to create deadline', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create deadline',
        })
      }
    }),

  upvote: userIsInGroup
    .input(upvoteDeadlineInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.deadline.update({
          where: {
            id: input.deadlineId,
          },
          data: {
            upvotes: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
          select: defaultDeadlineSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to upvote deadline', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upvote deadline',
        })
      }
    }),

  downvote: userIsInGroup
    .input(upvoteDeadlineInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.deadline.update({
          where: {
            id: input.deadlineId,
          },
          data: {
            upvotes: {
              delete: {
                id: ctx.session.user.id,
              },
            },
          },
          select: defaultDeadlineSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to downvote deadline', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to downvote deadline',
        })
      }
    }),

  delete: userIsInGroup
    .input(upvoteDeadlineInput)
    .use(async ({ next, ctx, input }) => {
      const deadline = await ctx.prisma.deadline.findUnique({
        where: {
          id: input.deadlineId,
        },
      })

      if (deadline === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        })
      }

      if (deadline.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      return next({
        ctx: {
          deadline,
        },
      })
    })
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.deadline.delete({
          where: {
            id: input.deadlineId,
          },
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to delete deadline', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete deadline',
        })
      }
    }),

  update: userIsInGroup
    .input(updateDeadlineInput)
    .use(async ({ next, ctx, input }) => {
      const deadline = await ctx.prisma.deadline.findUnique({
        where: {
          id: input.deadlineId,
        },
      })

      if (deadline === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        })
      }

      if (deadline.authorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      return next({
        ctx: {
          deadline,
        },
      })
    })
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.deadline.update({
          where: {
            id: input.deadlineId,
          },
          data: {
            name: input.name,
            dueDate: input.dueDate,
          },
          select: defaultDeadlineSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to update deadline', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update deadline',
        })
      }
    }),
})
