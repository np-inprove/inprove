import { InstitutionRole } from '@prisma/client'
import { z } from 'zod'

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

const institutionInviteInputBase = z.object({
  institutionId: z.string().cuid(),
})

export const createInstitutionInviteInput = institutionInviteInputBase.extend({
  role: z.nativeEnum(InstitutionRole),
})

export const deleteInstitutionInviteInput = institutionInviteInputBase.extend({
  inviteId: z.string().cuid(),
})

export type CreateInstitutionInviteInput = z.infer<typeof createInstitutionInviteInput>
export type DeleteInstitutionInviteInput = z.infer<typeof deleteInstitutionInviteInput>
