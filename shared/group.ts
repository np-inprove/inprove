import { GroupRole } from '@prisma/client'
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
export type UpdateGroupInput = z.infer<typeof updateGroupInput>
export type GetGroupInput = z.infer<typeof getGroupInput>

export const listGroupUsersInput = z.object({
  groupId: z.string().cuid(),
})

export const updateGroupUserInput = z.object({
  groupId: z.string().cuid(),
  userId: z.string().cuid(),
  role: z.nativeEnum(GroupRole),
})

export const removeGroupUserInput = z.object({
  groupId: z.string().cuid(),
  userId: z.string().cuid(),
})

export type ListGroupUsersInput = z.infer<typeof listGroupUsersInput>
export type UpdateGroupUserInput = z.infer<typeof updateGroupUserInput>
export type RemoveGroupUserInput = z.infer<typeof removeGroupUserInput>
