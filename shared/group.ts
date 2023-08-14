import { z } from 'zod'

export const createGroupInput = z.object({
  institutionId: z.string().cuid(),
  name: z.string().min(1),
  description: z.string(),
})

export const updateGroupInput = z.object({
  groupId: z.string().cuid(),
  name: z.string().min(1),
  description: z.string(),
})

export const getGroupInput = z.object({
  groupId: z.string().cuid(),
})

export type CreateGroupInput = z.infer<typeof createGroupInput>
export type GetGroupInput = z.infer<typeof getGroupInput>

export const listGroupUsersInput = z.object({
  groupId: z.string().cuid(),
})

export const removeGroupUserInput = z.object({
  groupId: z.string().cuid(),
  userId: z.string().cuid(),
})

export type ListGroupUsersInput = z.infer<typeof listGroupUsersInput>
export type UpdateGroupInput = z.infer<typeof updateGroupInput>
export type RemoveGroupUserInput = z.infer<typeof removeGroupUserInput>
