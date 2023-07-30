import { Prisma } from '@prisma/client'
import { defaultInstitutionSelect } from '../institution/institution.select'

/**
 * Default selector for User.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  admin: true,
  points: true,
  pointsAwardedCount: true,
  pointsAwardedResetTime: true,
  institutionRole: true,
  institution: {
    select: defaultInstitutionSelect,
  },
})

export type DefaultUser = Prisma.UserGetPayload<{ select: typeof defaultUserSelect }>
