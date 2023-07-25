import { Prisma } from '@prisma/client'

/**
 * Default selector for Group.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultGroupSelect = Prisma.validator<Prisma.GroupSelect>()({
  id: true,
  name: true,
  description: true,
})

export type DefaultGroup = Prisma.GroupGetPayload<{ select: typeof defaultGroupSelect }>
