import { z } from 'zod'

export const baseDeadlineInput = z.object({
  groupId: z.string().cuid(),
})

export const createDeadlineInput = baseDeadlineInput.extend({
  name: z.string().min(1),
  dueDate: z.date().min(new Date()),
})

export const toggleVoteDeadlineInput = baseDeadlineInput.extend({
  deadlineId: z.string().cuid(),
})

export const deleteDeadlineInput = baseDeadlineInput.extend({
  deadlineId: z.string().cuid(),
})

export const updateDeadlineInput = baseDeadlineInput.extend({
  deadlineId: z.string().cuid(),
  name: z.string().min(1),
  dueDate: z.date().min(new Date()),
})

export const listDeadlineInput = baseDeadlineInput.extend({})

export type CreateDeadlineInput = z.infer<typeof createDeadlineInput>
export type UpdateDeadlineInput = z.infer<typeof updateDeadlineInput>
export type ToggleVoteDeadlineInput = z.infer<typeof toggleVoteDeadlineInput>
export type DeleteDeadlineInput = z.infer<typeof deleteDeadlineInput>
