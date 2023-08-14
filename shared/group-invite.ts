import { z } from 'zod'
import { GroupRole } from './enums'

export const groupInviteInputBase = z.object({
  groupId: z.string().cuid(),
})

export const getGroupInviteInput = z.object({
  inviteId: z.string().cuid(),
})

export const acceptGroupInviteInput = getGroupInviteInput

export const createGroupInviteInput = groupInviteInputBase.extend({
  role: z.nativeEnum(GroupRole),
})

export const deleteGroupInviteInput = groupInviteInputBase.extend({
  inviteId: z.string().cuid(),
})

export type CreateGroupInviteInput = z.infer<typeof createGroupInviteInput>
export type DeleteGroupInviteInput = z.infer<typeof deleteGroupInviteInput>
export type AcceptGroupInviteInput = z.infer<typeof acceptGroupInviteInput>
