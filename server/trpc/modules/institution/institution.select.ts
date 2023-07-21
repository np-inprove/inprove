import { Prisma } from '@prisma/client'

/**
 * Default selector for Institution.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultInstitutionSelect = Prisma.validator<Prisma.InstitutionSelect>()({
  id: true,
  name: true,
})

type DefaultInstitution = Prisma.InstitutionGetPayload<{ select: typeof defaultInstitutionSelect }>
