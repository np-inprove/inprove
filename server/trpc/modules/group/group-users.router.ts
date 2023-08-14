import { TRPCError } from '@trpc/server'
import { defaultUserSelect } from '../user/user.select'
import { assertGroupRole } from '../rbac'
import { defaultGroupUsersSelect } from './group-users.select'
import { GroupRole } from '~/shared/enums'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { listGroupUsersInput, removeGroupUserInput } from '~/shared/group'

export const groupUsersRouter = router({
  list: protectedProcedure
    .input(listGroupUsersInput)
    // Check whether user is in group
    .use(async ({ next, ctx, input }) => {
      const groupUser = await ctx.prisma.groupUsers.findUnique({
        where: {
          groupId_userId: {
            userId: ctx.session.user.id,
            groupId: input.groupId,
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

      return next({
        ctx: {
          groupUser,
        },
      })
    })
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findMany({
          where: {
            groups: {
              some: {
                groupId: input.groupId,
              },
            },
          },
          select: defaultUserSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list group users', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list group users',
        })
      }
    }),

  remove: protectedProcedure
    .input(removeGroupUserInput)
    // Check whether user is in group
    .use(async ({ next, ctx, input }) => {
      const groupUser = await ctx.prisma.groupUsers.findUnique({
        where: {
          groupId_userId: {
            userId: ctx.session.user.id,
            groupId: input.groupId,
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

      return next({
        ctx: {
          groupUser,
        },
      })
    })
    .mutation(async ({ ctx, input }) => {
      assertGroupRole(ctx.groupUser, GroupRole.Educator, GroupRole.Owner)

      try {
        return await ctx.prisma.groupUsers.delete({
          where: {
            groupId_userId: {
              groupId: input.groupId,
              userId: input.userId,
            },
          },
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to delete group user', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete group user',
        })
      }
    }),

})
