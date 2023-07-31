import { z } from 'zod'

export const baseDeadlineInput = z.object({
  groupId: z.string().cuid(),
})

export const listDeadlineInput = baseDeadlineInput.extend({})
