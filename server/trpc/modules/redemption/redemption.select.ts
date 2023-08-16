import { Prisma } from '@prisma/client'
import { defaultVoucherSelect } from '../voucher/voucher.select'
import { defaultUserSelect } from '../user/user.select'

/**
 * Default selector for Redemption.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultRedemptionSelect = Prisma.validator<Prisma.RedemptionSelect>()({
  id: true,
  userId: true,
  voucherId: true,
  timestamp: true,
  claimed: true,
  voucher: {
    select: defaultVoucherSelect,
  },
  user: {
    select: defaultUserSelect,
  },
})

export type DefaultRedemption = Prisma.RedemptionGetPayload<{ select: typeof defaultRedemptionSelect }>
