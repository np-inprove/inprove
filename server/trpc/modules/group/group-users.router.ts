import { TRPCError } from '@trpc/server'
import { assertGroupRole } from '../rbac'
import { defaultGroupUsersSelect, detailedGroupUsersSelect } from './group-users.select'
import { GroupRole } from '~/shared/enums'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { listGroupUsersInput, removeGroupUserInput, updateGroupUserInput } from '~/shared/group'

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
        return await ctx.prisma.groupUsers.findMany({
          where: {
            groupId: input.groupId,
          },
          select: detailedGroupUsersSelect,
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

  me: protectedProcedure
    .input(listGroupUsersInput)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.groupUsers.findUnique({
          where: {
            groupId_userId: {
              userId: ctx.session.user.id,
              groupId: input.groupId,
            },
          },
          select: detailedGroupUsersSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to get group users', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get group users',
        })
      }
    }),

  update: protectedProcedure
    .input(updateGroupUserInput)
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
      if (input.role === GroupRole.Owner)
        assertGroupRole(ctx.groupUser, GroupRole.Owner)

      else if (input.role === GroupRole.Educator || input.role === GroupRole.Member)
        assertGroupRole(ctx.groupUser, GroupRole.Owner, GroupRole.Educator)

      try {
        return await ctx.prisma.groupUsers.update({
          where: {
            groupId_userId: {
              groupId: input.groupId,
              userId: input.userId,
            },
          },
          data: {
            role: input.role,
          },
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to update group user', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update group user',
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
