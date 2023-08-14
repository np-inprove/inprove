import { Prisma } from '@prisma/client'
import { defaultGroupSelect } from './group.select'

/**
 * Default selector for GroupInvite.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultGroupInviteSelect = Prisma.validator<Prisma.GroupInviteSelect>()({
  id: true,
  groupId: true,
  group: {
    select: defaultGroupSelect,
  },
  role: true,
})

export type DefaultGroupInvite = Prisma.GroupInviteGetPayload<{ select: typeof defaultGroupInviteSelect }>
