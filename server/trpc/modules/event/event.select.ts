import { Prisma } from '@prisma/client'

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
  allDay: true,
  location: true,
  rrule: true,
  groupId: true,
})

export type DefaultEvent = Prisma.EventGetPayload<{ select: typeof defaultEventSelect }>
