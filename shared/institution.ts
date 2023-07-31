import { z } from 'zod'

// TODO this is also bad - should find a way to keep this in sync with Prisma schema
export const institutionRole = {
  Admin: 'Admin',
  Educator: 'Educator',
  Member: 'Member',
}

export type InstitutionRole = (typeof institutionRole)[keyof typeof institutionRole]

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

export const getInstitutionInviteInput = z.object({
  inviteId: z.string().cuid(),
})

export const acceptInstitutionInviteInput = getInstitutionInviteInput

export const createInstitutionInviteInput = institutionInviteInputBase.extend({
  role: z.nativeEnum(institutionRole),
})

export const deleteInstitutionInviteInput = institutionInviteInputBase.extend({
  inviteId: z.string().cuid(),
})

export type CreateInstitutionInviteInput = z.infer<typeof createInstitutionInviteInput>
export type DeleteInstitutionInviteInput = z.infer<typeof deleteInstitutionInviteInput>
export type AcceptInstitutionInviteInput = z.infer<typeof acceptInstitutionInviteInput>
