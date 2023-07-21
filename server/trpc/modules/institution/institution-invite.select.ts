import { Prisma } from '@prisma/client'

/**
 * Default selector for InstitutionInvite.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultInstitutionInviteSelect = Prisma.validator<Prisma.InstitutionInviteSelect>()({
  id: true,
  role: true,
})

type DefaultInstitutionInvite = Prisma.InstitutionInviteGetPayload<{ select: typeof defaultInstitutionInviteSelect }>
