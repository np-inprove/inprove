import { Prisma } from '@prisma/client'
import { defaultGroupSelect } from '../group/group.select'

/**
 * Default selector for Event.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultEventSelect = Prisma.validator<Prisma.EventSelect>()({
  id: true,
  name: true,
  startTime: true,
  endTime: true,
  location: true,
  repeatPattern: true,
  groupId: true,
  group: {
    select: defaultGroupSelect,
  },
})

export type DefaultEvent = Prisma.EventGetPayload<{ select: typeof defaultEventSelect }>
