import { z } from 'zod'
import { InstitutionRole } from './enums'

export const createInstitutionInput = z.object({
  name: z.string().nonempty(),
})

export const updateInstitutionInput = createInstitutionInput.extend({
  id: z.string().cuid(),
})

export const deleteInstitutionInput = z.object({
  id: z.string().cuid(),
})

export type CreateInstitutionInput = z.infer<typeof createInstitutionInput>
export type UpdateInstitutionInput = z.infer<typeof updateInstitutionInput>
export type DeleteInstitutionInput = z.infer<typeof deleteInstitutionInput>

export const listUsersInput = z.object({
  id: z.string().cuid(),
})

export const removeUserInput = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
})

export type ListUsersInput = z.infer<typeof listUsersInput>

const institutionInviteInputBase = z.object({
  institutionId: z.string().cuid(),
})

export const getInstitutionInviteInput = z.object({
  inviteId: z.string().cuid(),
})

export const acceptInstitutionInviteInput = getInstitutionInviteInput

export const createInstitutionInviteInput = institutionInviteInputBase.extend({
  role: z.nativeEnum(InstitutionRole),
})

export const deleteInstitutionInviteInput = institutionInviteInputBase.extend({
  inviteId: z.string().cuid(),
})

export type CreateInstitutionInviteInput = z.infer<typeof createInstitutionInviteInput>
export type DeleteInstitutionInviteInput = z.infer<typeof deleteInstitutionInviteInput>
export type AcceptInstitutionInviteInput = z.infer<typeof acceptInstitutionInviteInput>
