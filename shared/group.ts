import { z } from 'zod'

export const createGroupInput = z.object({
  institutionId: z.string().cuid(),
  name: z.string().min(1),
  description: z.string(),
})

export type CreateGroupInput = z.infer<typeof createGroupInput>
