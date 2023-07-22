import { TRPCError } from '@trpc/server'
import { defaultInstitutionSelect } from './institution.select'
import { createInstitutionInput, deleteInstitutionInput, updateInstitutionInput } from '~/shared/institution'
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
})

// export type definition of API
export type InstitutionRouter = typeof institutionRouter
