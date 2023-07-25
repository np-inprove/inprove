import { Prisma } from '@prisma/client'
import { defaultUserSelect } from '../user/user.select'
import { defaultGroupSelect } from './group.select'

/**
 * Default selector for GroupUsers.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultGroupUsersSelect = Prisma.validator<Prisma.GroupUsersSelect>()({
  id: true,
  role: true,
  groupId: true,
  userId: true,
  group: {
    select: defaultGroupSelect,
  },
  user: {
    select: defaultUserSelect,
  },
})

export type DefaultGroupUsers = Prisma.GroupUsersGetPayload<{ select: typeof defaultGroupUsersSelect }>
