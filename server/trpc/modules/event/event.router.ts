import { TRPCError } from '@trpc/server'
import addDays from 'date-fns/addDays/index.js'
import intervalToDuration from 'date-fns/intervalToDuration/index.js'
import add from 'date-fns/add/index.js'
import * as rrule from 'rrule'
import { defaultDeadlineSelect } from '../deadline/deadline.select'
import type { DefaultEvent } from './event.select'
import { defaultEventSelect } from './event.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { baseEventInput, createEventInput, upcomingEventsInput } from '~/shared/event'

const { rrulestr } = rrule

const userIsInGroup = protectedProcedure
  .input(baseEventInput)
  .use(async ({ next, ctx, input }) => {
    try {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          users: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      })

      // TODO caught locally
      if (group === null) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      return next({
        ctx: {
          group,
        },
      })
    }
    catch (err) {
      ctx.logger.error({ msg: 'failed to verify user in group', err })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to verify user in group',
      })
    }
  })

export const eventRouter = router({
  // By default, will list events that occur in the next 3 days,
  // unless otherwise specified by input.date
  upcoming: userIsInGroup
    .input(upcomingEventsInput)
    .query(async ({ ctx, input }) => {
      try {
        const today = (() => {
          const d = new Date()
          d.setHours(0, 0, 0, 0)
          return d
        })()

        const deadlines = await ctx.prisma.deadline.findMany({
          where: {
            groupId: input.groupId,
            dueDate: {
              lt: addDays(input.date ?? today, 3),
            },
          },
          select: defaultDeadlineSelect,
        })

        const events = await ctx.prisma.event.findMany({
          where: {
            groupId: input.groupId,
            OR: [
              {
                startTime: {
                  gt: today,
                  lt: addDays(input.date ?? today, 3),
                },
              },
              {
                endTime: {
                  lt: addDays(input.date ?? today, 3),
                },
              },
            ],
            rrule: null,
          },
          select: defaultEventSelect,
        })

        // Get all recurring events
        const recurringEvents = await ctx.prisma.event.findMany({
          where: {
            groupId: input.groupId,
            rrule: {
              not: null,
            },
          },
        })

        // Events + those which are repeated
        const combinedEvents: DefaultEvent[] = events

        recurringEvents.forEach((event) => {
          const rrule = rrulestr(event.rrule!)
          const dates = rrule.between(input.date ?? today, addDays(input.date ?? today, 3))
          const interval = intervalToDuration({
            start: event.startTime,
            end: event.endTime,
          })

          dates.forEach((start) => { // Start should have the same time as startTime, just repeated date
            const startTime = new Date(start)
            combinedEvents.push({
              ...event,
              startTime,
              endTime: add(start, interval),
            })
          })
        })

        return {
          deadlines,
          events: combinedEvents,
        }
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list events', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list events',
        })
      }
    }),

  create: userIsInGroup
    .input(createEventInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.event.create({
          data: {
            name: input.name,
            startTime: input.startTime,
            endTime: input.endTime,
            location: input.location,
            groupId: input.groupId,
            rrule: input.rrule,
          },
          select: defaultEventSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to create event', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create event',
        })
      }
    }),

  // toggleVote: userIsInGroup
  //   .input(toggleVoteDeadlineInput)
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const upvoted = await ctx.prisma.deadline.findUnique({
  //         where: {
  //           id: input.deadlineId,
  //           upvotes: {
  //             some: {
  //               id: ctx.session.user.id,
  //             },
  //           },
  //         },
  //       })

  //       if (upvoted === null) {
  //         return await ctx.prisma.deadline.update({
  //           where: {
  //             id: input.deadlineId,
  //           },
  //           data: {
  //             upvotes: {
  //               connect: {
  //                 id: ctx.session.user.id,
  //               },
  //             },
  //           },
  //         })
  //       }

  //       return await ctx.prisma.deadline.update({
  //         where: {
  //           id: input.deadlineId,
  //         },
  //         data: {
  //           upvotes: {
  //             disconnect: {
  //               id: ctx.session.user.id,
  //             },
  //           },
  //         },
  //         select: defaultDeadlineSelect,
  //       })
  //     }
  //     catch (err) {
  //       ctx.logger.error({ msg: 'failed to upvote deadline', err })
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to upvote deadline',
  //       })
  //     }
  //   }),

  // delete: userIsInGroup
  //   .input(toggleVoteDeadlineInput)
  //   .use(async ({ next, ctx, input }) => {
  //     const deadline = await ctx.prisma.deadline.findUnique({
  //       where: {
  //         id: input.deadlineId,
  //       },
  //     })

  //     if (deadline === null) {
  //       throw new TRPCError({
  //         code: 'NOT_FOUND',
  //       })
  //     }

  //     if (deadline.authorId !== ctx.session.user.id) {
  //       throw new TRPCError({
  //         code: 'UNAUTHORIZED',
  //       })
  //     }

  //     return next({
  //       ctx: {
  //         deadline,
  //       },
  //     })
  //   })
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       return await ctx.prisma.deadline.delete({
  //         where: {
  //           id: input.deadlineId,
  //         },
  //       })
  //     }
  //     catch (err) {
  //       ctx.logger.error({ msg: 'failed to delete deadline', err })
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to delete deadline',
  //       })
  //     }
  //   }),

  // update: userIsInGroup
  //   .input(updateDeadlineInput)
  //   .use(async ({ next, ctx, input }) => {
  //     const deadline = await ctx.prisma.deadline.findUnique({
  //       where: {
  //         id: input.deadlineId,
  //       },
  //     })

  //     if (deadline === null) {
  //       throw new TRPCError({
  //         code: 'NOT_FOUND',
  //       })
  //     }

  //     if (deadline.authorId !== ctx.session.user.id) {
  //       throw new TRPCError({
  //         code: 'UNAUTHORIZED',
  //       })
  //     }

  //     return next({
  //       ctx: {
  //         deadline,
  //       },
  //     })
  //   })
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       return await ctx.prisma.deadline.update({
  //         where: {
  //           id: input.deadlineId,
  //         },
  //         data: {
  //           name: input.name,
  //           dueDate: input.dueDate,
  //         },
  //         select: defaultDeadlineSelect,
  //       })
  //     }
  //     catch (err) {
  //       ctx.logger.error({ msg: 'failed to update deadline', err })
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to update deadline',
  //       })
  //     }
  //   }),
})
