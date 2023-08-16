import { TRPCError } from '@trpc/server'
import { defaultQuizSelect } from './quiz.select'
import { defaultQuestionSelect } from './question.select'
import { QuestionType } from '~/shared/enums'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import type { CombinedQuestion } from '~/shared/quiz'
import {
  baseQuizInput,
  bulkUpsertQuestionInput,
  createQuizInput,
  getQuizInput,
  listQuestionsInput,
  listQuizzesInput,
} from '~/shared/quiz'

const userIsInGroup = protectedProcedure
  .input(baseQuizInput)
  .use(async ({
    next,
    ctx,
    input,
  }) => {
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
      ctx.logger.error({
        msg: 'failed to verify user in group',
        err,
      })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to verify user in group',
      })
    }
  })

export const quizRouter = router({
  list: userIsInGroup
    .input(listQuizzesInput)
    .query(async ({
      ctx,
      input,
    }) => {
      try {
        return await ctx.prisma.quiz.findMany({
          where: {
            groupId: input.groupId,
          },
          select: defaultQuizSelect,
        })
      }
      catch (err) {
        ctx.logger.error({
          msg: 'failed to list quizzes',
          err,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list quizzes',
        })
      }
    }),

  get: protectedProcedure
    .input(getQuizInput)
    .use(async ({
      next,
      ctx,
      input,
    }) => {
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
    .query(async ({
      ctx,
      input,
    }) => {
      try {
        return await ctx.prisma.quiz.findUnique({
          where: {
            id: input.quizId,
          },
          select: defaultQuizSelect,
        })
      }
      catch (err) {
        ctx.logger.error({
          msg: 'failed to get quiz',
          err,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get quiz',
        })
      }
    }),

  create: userIsInGroup
    .input(createQuizInput)
    .mutation(async ({
      ctx,
      input,
    }) => {
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
        ctx.logger.error({
          msg: 'failed to create quiz',
          err,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create quiz',
        })
      }
    }),

  listQuestions: protectedProcedure
    .input(listQuestionsInput)
  // TODO should generalize this as well as input
    .use(async ({
      next,
      ctx,
      input,
    }) => {
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
    .query(async ({
      ctx,
      input,
    }) => {
      try {
        const qns = await ctx.prisma.question.findMany({
          where: {
            quizId: input.quizId,
          },
          select: defaultQuestionSelect,
        })

        const merged: CombinedQuestion[] = []

        for (const qn of qns) {
          if (qn.type === QuestionType.File) {
            const d = await ctx.prisma.fileQuestion.findUnique({
              where: { id: qn.id },
            })
            const m = { ...qn, ...d, type: QuestionType.File }
            merged.push(m)
          }
          else if (qn.type === QuestionType.Text) {
            const d = await ctx.prisma.textQuestion.findUnique({
              where: { id: qn.id },
            })
            const m = { ...qn, ...d, type: QuestionType.Text }
            merged.push(m)
          }
          else {
            const d = await ctx.prisma.optionsQuestion.findUnique({
              where: { id: qn.id },
            })
            const m = { ...qn, ...d, type: QuestionType.Options }
            merged.push(m)
          }
        }

        return merged
      }
      catch (err) {
        ctx.logger.error({
          msg: 'failed to list questions',
          err,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list questions',
        })
      }
    }),

  bulkUpsertQuestions: protectedProcedure
    .input(bulkUpsertQuestionInput)
    .mutation(async ({
      ctx,
      input,
    }) => {
      try {
        return await ctx.prisma.$transaction(async (prisma) => {
          for (const qn of input.questions) {
            let t
            if (!qn.id) {
              t = await prisma.question.create({
                data: {
                  content: qn.content,
                  description: qn.description,
                  points: qn.points,
                  type: qn.type,
                  quizId: input.quizId,
                },
                select: defaultQuestionSelect,
              })
            }
            else {
              t = await ctx.prisma.question.update({
                where: {
                  id: qn.id,
                },
                data: {
                  content: qn.content,
                  description: qn.description,
                  points: qn.points,
                  type: qn.type,
                  quizId: input.quizId,
                },
                select: defaultQuestionSelect,
              })
            }

            switch (qn.type) {
              case QuestionType.File: {
                if (!qn.id) {
                  await prisma.fileQuestion.create({
                    data: {
                      id: t.id,
                    },
                  })
                }
                break
              }

              case QuestionType.Options: {
                const data = {
                  options: qn.options,
                  correctOptions: qn.correctOptions,
                }

                if (!qn.id) {
                  await prisma.optionsQuestion.create({
                    data: {
                      id: t.id,
                      ...data,
                    },
                  })
                }
                else {
                  await prisma.optionsQuestion.update({
                    where: {
                      id: qn.id,
                    },
                    data,
                  })
                }

                break
              }

              case QuestionType.Text: {
                const data = {
                  answer: qn.answer,
                }

                if (!qn.id) {
                  await prisma.textQuestion.create({
                    data: {
                      id: t.id,
                      ...data,
                    },
                  })
                }
                else {
                  await prisma.textQuestion.update({
                    where: {
                      id: t.id,
                    },
                    data,
                  })
                }
                break
              }
            }
          }
        })
      }
      catch (err) {
        ctx.logger.error({
          msg: 'failed to bulk upsert questions',
          err,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to bulk upsert questions',
        })
      }
    }),
})
