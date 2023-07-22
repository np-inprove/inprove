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
