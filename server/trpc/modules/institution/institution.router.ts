import { TRPCError } from '@trpc/server'
import { defaultInstitutionSelect } from './institution.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'

export const institutionRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.institution.findMany({ select: defaultInstitutionSelect })
      }
      catch (err) {
        ctx.logger.error('error listing institutions', { err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list institutions',
        })
      }
    }),
})

// export type definition of API
export type InstitutionRouter = typeof institutionRouter
