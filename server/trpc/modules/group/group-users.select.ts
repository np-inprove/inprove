import { Prisma } from '@prisma/client'

/**
 * Default selector for GroupUsers.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultGroupUsersSelect = Prisma.validator<Prisma.GroupUsersSelect>()({
  role: true,
  groupId: true,
  userId: true,
})

export type DefaultGroupUsers = Prisma.GroupUsersGetPayload<{ select: typeof defaultGroupUsersSelect }>
