import { z } from 'zod'

export const createVoucherInput = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  pointsRequired: z.number().min(0),
})

export const redeemVoucherInput = z.object({
  voucherId: z.string().cuid(),
})

export type CreateVoucherInput = z.infer<typeof createVoucherInput>
export type RedeemVoucherInput = z.infer<typeof redeemVoucherInput>
