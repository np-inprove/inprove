import { z } from 'zod'

export const createGroupInput = z.object({
  institutionId: z.string().cuid(),
  name: z.string().min(1),
  description: z.string(),
})

export const getGroupInput = z.object({
  groupId: z.string().cuid(),
})

export type CreateGroupInput = z.infer<typeof createGroupInput>
export type GetGroupInput = z.infer<typeof getGroupInput>
