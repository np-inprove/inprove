import { Prisma } from '@prisma/client'

/**
 * Default selector for Voucher.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultVoucherSelect = Prisma.validator<Prisma.VoucherSelect>()({
  id: true,
  name: true,
  description: true,
  pointsRequired: true,
})

export type DefaultVoucher = Prisma.VoucherGetPayload<{ select: typeof defaultVoucherSelect }>
