import { TRPCError } from '@trpc/server'
import { QuestionType } from '@prisma/client'
import { defaultQuizSelect } from './quiz.select'
import { defaultQuestionSelect } from './question.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { baseQuizInput, bulkUpsertQuestionInput, createQuizInput, getQuizInput, listQuestionsInput, listQuizzesInput } from '~/shared/quiz'

const userIsInGroup = protectedProcedure
  .input(baseQuizInput)
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
          code: 'FORBIDDEN',
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

export const quizRouter = router({
  list: userIsInGroup
    .input(listQuizzesInput)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.quiz.findMany({
          where: {
            groupId: input.groupId,
          },
          select: defaultQuizSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list quizzes', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list quizzes',
        })
      }
    }),

  get: protectedProcedure
    .input(getQuizInput)
    .use(async ({ next, ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.quizId,
          group: {
            users: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      })

      if (quiz === null)
        throw new TRPCError({ code: 'NOT_FOUND' })

      return next({
        ctx: {
          quiz,
        },
      })
    })
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.quiz.findUnique({
          where: {
            id: input.quizId,
          },
          select: defaultQuizSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to get quiz', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get quiz',
        })
      }
    }),

  create: userIsInGroup
    .input(createQuizInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.quiz.create({
          data: {
            name: input.name,
            description: input.description,
            authorId: ctx.session.user.id,
            groupId: input.groupId,
          },
          select: defaultQuizSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to create quiz', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create quiz',
        })
      }
    }),

  listQuestions: protectedProcedure
    .input(listQuestionsInput)
    // TODO should generalize this as well as input
    .use(async ({ next, ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.quizId,
          group: {
            users: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      })

      if (quiz === null)
        throw new TRPCError({ code: 'NOT_FOUND' })

      return next({
        ctx: {
          quiz,
        },
      })
    })
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.$transaction(async (prisma) => {
          const qns = await prisma.question.findMany({
            where: {
              quizId: input.quizId,
            },
            select: defaultQuestionSelect,
          })

          const queryList = qns.map(async (qn) => {
            switch (qn.type) {
              case QuestionType.File: {
                const d = await prisma.fileQuestion.findUnique({
                  where: { id: qn.id },
                })
                return { ...qn, ...d }
              }
              case QuestionType.Text: {
                const d = await prisma.textQuestion.findUnique({
                  where: { id: qn.id },
                })
                return { ...qn, ...d }
              }
              case QuestionType.Options: {
                const d = await prisma.optionsQuestion.findUnique({
                  where: { id: qn.id },
                })
                return { ...qn, ...d }
              }
              default:
                throw new Error('Invariant')
            }
          })

          return await Promise.all(queryList)
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list questions', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list questions',
        })
      }
    }),

  bulkUpsertQuestions: protectedProcedure
    .input(bulkUpsertQuestionInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const stmts = []

        for (const qn of input.questions) {
          stmts.push(ctx.prisma.question.upsert({
            where: {
              id: qn.id,
            },
            update: {
              content: qn.content,
              description: qn.description,
              points: qn.points,
              type: qn.type,
              quizId: input.quizId,
            },
            create: {
              content: qn.content,
              description: qn.description,
              points: qn.points,
              type: qn.type,
              quizId: input.quizId,
            },
            select: defaultQuestionSelect,
          }))

          switch (qn.type) {
            case QuestionType.File: {
              stmts.push(ctx.prisma.fileQuestion.create({
                data: {
                  id: qn.id,
                },
              }))
              break
            }

            case QuestionType.Options: {
              stmts.push(ctx.prisma.optionsQuestion.create({
                data: {
                  id: qn.id,
                  options: qn.options,
                  correctOptions: qn.correctOptions,
                },
              }))
              break
            }

            case QuestionType.Text: {
              stmts.push(ctx.prisma.textQuestion.create({
                data: {
                  id: qn.id,
                  answer: qn.answer,
                },
              }))
              break
            }
          }
        }

        return await ctx.prisma.$transaction(stmts)
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to bulk upsert questions', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to bulk upsert questions',
        })
      }
    }),
})
