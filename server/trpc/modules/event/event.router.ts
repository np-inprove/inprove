import { TRPCError } from '@trpc/server'
import addDays from 'date-fns/addDays/index.js'
import { defaultDeadlineSelect } from '../deadline/deadline.select'
import { defaultEventSelect } from './event.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { baseEventInput, eventRepeatConfig, upcomingEventsInput } from '~/shared/event'

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
            dueDate: {
              lt: addDays(today, 3),
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
                  lt: addDays(today, 3),
                },
              }, {
                endTime: {
                  lt: addDays(today, 3),
                },
              },
            ],
          },
          select: defaultEventSelect,
        })

        return {
          deadlines,
          events: events.map(event => ({
            ...event,
            repeat: eventRepeatConfig.parse(event.repeat),
          })),
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

  // create: userIsInGroup
  //   .input(createDeadlineInput)
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       return await ctx.prisma.deadline.create({
  //         data: {
  //           name: input.name,
  //           dueDate: input.dueDate,
  //           groupId: input.groupId,
  //           authorId: ctx.session.user.id,
  //         },
  //         select: defaultDeadlineSelect,
  //       })
  //     }
  //     catch (err) {
  //       ctx.logger.error({ msg: 'failed to create deadline', err })
  //       throw new TRPCError({
  //         code: 'INTERNAL_SERVER_ERROR',
  //         message: 'Failed to create deadline',
  //       })
  //     }
  //   }),

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
