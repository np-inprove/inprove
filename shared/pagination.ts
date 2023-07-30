import { z } from 'zod'

export const paginator = z.object({
  cursor: z.string().cuid(),
  take: z.number().min(1).max(50).default(30),
})
