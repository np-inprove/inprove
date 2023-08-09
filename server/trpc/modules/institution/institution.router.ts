import { TRPCError } from '@trpc/server'
import { defaultInstitutionSelect } from './institution.select'
import { createInstitutionInput, deleteInstitutionInput, listUsersInput, removeUserInput, updateInstitutionInput } from '~/shared/institution'
import { protectedProcedure, router } from '~/server/trpc/trpc'

export const institutionRouter = router({
  list: protectedProcedure
    .meta({ admin: true })
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.institution.findMany({ select: defaultInstitutionSelect })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to list institutions' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list institutions',
        })
      }
    }),

  create: protectedProcedure
    .meta({ admin: true })
    .input(createInstitutionInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.institution.create({
          data: { name: input.name },
          select: defaultInstitutionSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to create institution' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create institution',
        })
      }
    }),

  update: protectedProcedure
    .meta({ admin: true })
    .input(updateInstitutionInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.institution.update({
          where: { id: input.id },
          data: {
            name: input.name,
          },
          select: defaultInstitutionSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to update institution' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create institution',
        })
      }
    }),

  delete: protectedProcedure
    .meta({ admin: true })
    .input(deleteInstitutionInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.institution.delete({
          where: { id: input.id },
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to delete institution' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create institution',
        })
      }
    }),

  listUsers: protectedProcedure
    .meta({ admin: true })
    .input(listUsersInput)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findMany({
          where: {
            institution: {
              id: input.id,
            },
          },
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to list institution users' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list institution users',
        })
      }
    }),

  removeUser: protectedProcedure
    .meta({ admin: true })
    .input(removeUserInput)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            institutionId: null,
            institutionRole: null,
          },
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to remove institution use' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove institution user',
        })
      }
    }),
})

// export type definition of API
export type InstitutionRouter = typeof institutionRouter
