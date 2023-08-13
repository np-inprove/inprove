import { TRPCError } from '@trpc/server'
import { defaultGroupUsersSelect } from '../group/group-users.select'
import { defaultGroupSelect } from '../group/group.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { getForumInput, listForumInput } from '~/shared/forum'

export const forumRouter = router({
  list: protectedProcedure
    .input(listForumInput)
    .use(async ({ next, ctx, input }) => {
      const groupUser = await ctx.prisma.groupUsers.findUnique({
        where: {
          groupId_userId: {
            userId: ctx.session.user.id,
            groupId: input.groupId,
          },
        },
        select: {
          ...defaultGroupUsersSelect,
          group: {
            select: defaultGroupSelect,
          },
        },
      })

      if (groupUser === null) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User does not have sufficient permissions.',
        })
      }

      return next({
        ctx: {
          groupUser,
        },
      })
    })
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.forum.findMany({
        where: { groupId: input.groupId },
      })
    }),

  get: protectedProcedure
    .input(getForumInput)
    .use(async ({ next, ctx, input }) => {
      const forum = await ctx.prisma.forum.findUnique({
        where: { id: input.forumId },
      })

      if (forum === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Forum does not exist',
        })
      }

      return next({
        ctx: {
          forum,
        },
      })
    })
    .use(async ({ next, ctx }) => {
      const groupUser = await ctx.prisma.groupUsers.findUnique({
        where: {
          groupId_userId: {
            userId: ctx.session.user.id,
            groupId: ctx.forum.groupId,
          },
        },
        select: defaultGroupUsersSelect,
      })

      if (groupUser === null) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User does not have sufficient permissions.',
        })
      }

      return next()
    })
    .query(async ({ ctx, input }) => {
      // From the use() above, we know that forum is not null
      return ctx.forum
    }),
})
