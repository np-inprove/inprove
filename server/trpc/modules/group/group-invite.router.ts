import { TRPCError } from '@trpc/server'
import { GroupRole, Prisma } from '@prisma/client'
import { assertGroupRole } from '../rbac'
import { defaultGroupUsersSelect } from './group-users.select'
import { defaultGroupInviteSelect } from './group-invite.select'
import { defaultGroupSelect } from './group.select'
import { protectedProcedure, publicProcedure, router } from '~/server/trpc/trpc'
import { acceptGroupInviteInput, createGroupInviteInput, deleteGroupInviteInput, getGroupInviteInput, groupInviteInputBase } from '~/shared/group-invite'

// TODO update to use shared input etc.
const userIsInGroup = protectedProcedure
  .input(groupInviteInputBase)
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

export const groupInviteRouter = router({
  list: userIsInGroup
    .query(async ({ ctx, input }) => {
      assertGroupRole(ctx.groupUser, GroupRole.Owner, GroupRole.Educator)

      try {
        return await ctx.prisma.groupInvite.findMany({
          where: { groupId: input.groupId },
          select: defaultGroupInviteSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to list group invites' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list gorup invites',
        })
      }
    }),

  // Public as users need to access the invite link
  get: publicProcedure
    .input(getGroupInviteInput)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.groupInvite.findUniqueOrThrow({
          where: { id: input.inviteId },
          select: {
            ...defaultGroupInviteSelect,
            group: {
              select: defaultGroupSelect,
            },
          },
        })
      }
      catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2025') { // Not found
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Invite does not exist',
            })
          }
        }

        ctx.logger.error({ err, msg: 'failed to get group invite' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get group invite',
        })
      }
    }),

  accept: protectedProcedure
    .input(acceptGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const invite = await ctx.prisma.groupInvite.findUniqueOrThrow({
          where: { id: input.inviteId },
          select: {
            ...defaultGroupInviteSelect,
            groupId: true,
          },
        })

        return await ctx.prisma.groupUsers.create({
          data: {
            role: invite.role,
            groupId: invite.groupId,
            userId: ctx.session.user.id,
          },
          select: defaultGroupUsersSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to accept group invite' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to accept group invite',
        })
      }
    }),

  create: userIsInGroup
    .input(createGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      assertGroupRole(ctx.groupUser, GroupRole.Owner, GroupRole.Educator)

      try {
        return await ctx.prisma.groupInvite.create({
          data: {
            role: input.role as GroupRole, // TODO this is bad, but eh, it works I suppose?
            groupId: input.groupId,
          },
          select: defaultGroupInviteSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to create group invite' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create group invite',
        })
      }
    }),

  delete: userIsInGroup
    .input(deleteGroupInviteInput)
    .mutation(async ({ ctx, input }) => {
      assertGroupRole(ctx.groupUser, GroupRole.Owner, GroupRole.Educator)

      const invite = await ctx.prisma.groupInvite.findUnique({
        where: { id: input.inviteId },
      })

      if (invite === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Group invite does not exist',
        })
      }

      try {
        return await ctx.prisma.groupInvite.delete({
          where: { id: input.inviteId },
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to delete group invite' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete group invite',
        })
      }
    }),

})

// export type definition of API
export type GroupInviteRouter = typeof groupInviteRouter
