import { TRPCError } from '@trpc/server'
import { defaultRedemptionSelect } from '../redemption/redemption.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { redeemClaimInput } from '~/shared/voucher'

export const redeemRouter = router({

  list: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.redemption.findMany({
          where: {
            userId: ctx.session.user.id,
          },
          select: defaultRedemptionSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list redeemed vouchers', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list redeemed vouchers',
        })
      }
    }),

  claim: protectedProcedure
    .input(redeemClaimInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.redemption.update({
          where: {
            id: input.redemptionId,
            userId: ctx.session.user.id,
          },
          data: {
            claimed: true,
          },
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to claim voucher', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to claim voucher',
        })
      }
    },
    ),

})
