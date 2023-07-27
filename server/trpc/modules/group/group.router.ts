import { TRPCError } from '@trpc/server'
import { GroupRole, InstitutionRole } from '@prisma/client'
import { assertInstitutionRole } from '../rbac'
import { defaultGroupSelect } from './group.select'
import { defaultGroupUsersSelect } from './group-users.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { createGroupInput, getGroupInput } from '~/shared/group'

export const groupRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.group.findMany({
          where: {
            users: {
              every: {
                userId: ctx.session.user.id,
              },
            },
          },
          select: defaultGroupSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list groups', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list groups',
        })
      }
    }),

  create: protectedProcedure
    .input(createGroupInput)
    .mutation(async ({ ctx, input }) => {
      try {
        assertInstitutionRole(ctx.session.user, InstitutionRole.Admin, InstitutionRole.Educator)

        return await ctx.prisma.group.create({
          data: {
            users: {
              create: {
                userId: ctx.session.user.id,
                role: GroupRole.Owner,
              },
            },
            forums: {
              create: {
                name: 'General',
                description: 'Banter talk',
                posts: {
                  create: {
                    authorId: ctx.session.user.id,
                    title: `General forum for ${input.name}`,
                    content: 'More exciting content to come!',
                  },
                },
              },
            },
            name: input.name,
            description: input.description,
            institutionId: ctx.session.user.institution!.id,
          },
          select: defaultGroupSelect,
        })
      }
      catch (err) {
        // RBAC assertion throws TRPCError
        if (!(err instanceof TRPCError)) {
          ctx.logger.error({ msg: 'failed to create group', err })
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create group',
          })
        }
        throw err
      }
    }),

  get: protectedProcedure
    .input(getGroupInput)
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
          code: 'UNAUTHORIZED',
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
        const group = await ctx.prisma.group.findUnique({
          where: {
            id: input.groupId,
          },
          select: defaultGroupSelect,
        })

        if (group === null) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found',
          })
        }

        return group
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to get group', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get group',
        })
      }
    }),
})
