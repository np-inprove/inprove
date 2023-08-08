import { TRPCError } from '@trpc/server'
import { InstitutionRole } from '@prisma/client'
import { assertInstitutionRole } from '../rbac'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { createVoucherInput } from '~/shared/voucher'

export const voucherRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      assertInstitutionRole(ctx.session.user, InstitutionRole.Admin, InstitutionRole.Educator, InstitutionRole.Member)

      try {
        return await ctx.prisma.voucher.findMany({
          where: {
            institutionId: ctx.session.user.institution?.id,
          },
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list vouchers', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list vouchers',
        })
      }
    }),

  create: protectedProcedure
    .input(createVoucherInput)
    .mutation(async ({ ctx, input }) => {
      assertInstitutionRole(ctx.session.user, InstitutionRole.Admin)

      try {
        return await ctx.prisma.voucher.create({
          data: {
            name: input.name,
            description: input.description,
            pointsRequired: input.pointsRequired,
            institutionId: ctx.session.user.institutionId!, // TODO check voucher README
          },
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to create voucher', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create voucher',
        })
      }
    }),
})
