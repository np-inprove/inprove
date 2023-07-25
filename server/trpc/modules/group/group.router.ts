import { TRPCError } from '@trpc/server'
import { GroupRole, InstitutionRole } from '@prisma/client'
import { assertInstitutionRole } from '../rbac'
import { defaultGroupSelect } from './group.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { createGroupInput } from '~/shared/group'

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
        assertInstitutionRole(ctx.session.user, [InstitutionRole.Admin, InstitutionRole.Educator])

        return await ctx.prisma.group.create({
          data: {
            users: {
              create: {
                userId: ctx.session.user.id,
                role: GroupRole.Owner,
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
})
