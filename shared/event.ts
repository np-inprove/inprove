import { z } from 'zod'

// export const eventRepeatInternalShort = z.enum(['day', 'week', 'month', 'year'])
// export const eventRepeatInterval = z.enum(['days', 'weeks', 'months', 'years'])
// export const dayOfWeek = z.number().min(1).max(7)
// export const dayInMonth = z.number().min(-31).max(31)
// export const weekInMonth = z.number().min(-6).max(6)
// export const monthInYear = z.number().min(1).max(12)
// export const singleOrArray = (t: AnyZodObject | ZodNumber) => t.or(z.array(t))

// export const baseEventRepeatConfig = z.object({
//   every: eventRepeatInternalShort.or(z.tuple([z.number(), eventRepeatInterval])),
//   until: z.date(),
//   weekdays: singleOrArray(dayOfWeek),
//   days: singleOrArray(dayInMonth),
//   weeks: singleOrArray(weekInMonth),
//   months: singleOrArray(monthInYear),
//   years: singleOrArray(z.number()),
//   ordinalWeekdays: singleOrArray(z.number()),
// })

// export const eventRepeatConfig = baseEventRepeatConfig.extend({
//   on: singleOrArray(baseEventRepeatConfig.partial()),
// })

export const baseEventInput = z.object({
  groupId: z.string().cuid(),
})

export const createEventInput = baseEventInput.extend({
  name: z.string().min(1),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string(),
  rrule: z.string(),
})

export const deleteEventInput = baseEventInput.extend({
  eventId: z.string().cuid(),
})

export const updateEventInput = baseEventInput.extend({
  eventId: z.string().cuid(),
  name: z.string().min(1),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string(),
  rrule: z.string(),
})

export const upcomingEventsInput = baseEventInput.extend({
  date: z.date().optional(), // Specific date to list events on
})

export type CreateEventInput = z.infer<typeof createEventInput>
export type UpdateEventInput = z.infer<typeof updateEventInput>
export type DeleteEventInput = z.infer<typeof deleteEventInput>
