import { Prisma } from '@prisma/client'
import { defaultUserSelect } from '../user/user.select'
import { defaultGroupSelect } from '../group/group.select'

/**
 * Default selector for Deadline.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultDeadlineSelect = Prisma.validator<Prisma.DeadlineSelect>()({
  id: true,
  name: true,
  dueDate: true,
  authorId: true,
  author: {
    select: defaultUserSelect,
  },
  groupId: true,
  group: {
    select: defaultGroupSelect,
  },
})

export type DefaultDeadline = Prisma.DeadlineGetPayload<{ select: typeof defaultDeadlineSelect }>
