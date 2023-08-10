import { TRPCError } from '@trpc/server'
import { InstitutionRole } from '@prisma/client'
import { assertInstitutionRole } from '../rbac'
import { defaultRedemptionSelect } from '../redemption/redemption.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { createVoucherInput, redeemVoucherInput } from '~/shared/voucher'

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

  listRedeemed: protectedProcedure
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

  redeem: protectedProcedure
    .input(redeemVoucherInput)
    .mutation(async ({ ctx, input }) => {
      assertInstitutionRole(ctx.session.user, InstitutionRole.Admin, InstitutionRole.Educator, InstitutionRole.Member)

      try {
        const voucher = await ctx.prisma.voucher.findUnique({
          where: { id: input.voucherId },
        })

        if (voucher === null) {
          throw new TRPCError({
            code: 'NOT_FOUND',
          })
        }

        if (voucher.pointsRequired > ctx.session.user.points) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User does not have enough points',
          })
        }

        const data = await ctx.prisma.$transaction([
          ctx.prisma.user.update({
            where: { id: ctx.session.user.id },
            data: {
              points: {
                decrement: voucher.pointsRequired,
              },
            },
          }),
          ctx.prisma.redemption.create({
            data: {
              voucherId: voucher.id,
              userId: ctx.session.user.id,
            },
          }),
        ])

        return data[0]
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to redeem voucher', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to redeem voucher',
        })
      }
    }),

})
