import { z } from 'zod'

// TODO this is also bad - should find a way to keep this in sync with Prisma schema
export const groupRole = {
  Owner: 'Owner',
  Educator: 'Educator',
  Member: 'Member',
}

export type GroupRole = (typeof groupRole)[keyof typeof groupRole]

export const groupInviteInputBase = z.object({
  groupId: z.string().cuid(),
})

export const getGroupInviteInput = z.object({
  inviteId: z.string().cuid(),
})

export const acceptGroupInviteInput = getGroupInviteInput

export const createGroupInviteInput = groupInviteInputBase.extend({
  role: z.nativeEnum(groupRole),
})

export const deleteGroupInviteInput = groupInviteInputBase.extend({
  inviteId: z.string().cuid(),
})

export type CreateGroupInviteInput = z.infer<typeof createGroupInviteInput>
export type DeleteGroupInviteInput = z.infer<typeof deleteGroupInviteInput>
export type AcceptGroupInviteInput = z.infer<typeof acceptGroupInviteInput>
