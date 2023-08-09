import { TRPCError } from '@trpc/server'
import { QuestionType } from '@prisma/client'
import { defaultQuizSelect } from './quiz.select'
import { defaultQuestionSelect } from './question.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { addQuestionInput, baseQuizInput, createQuizInput, listQuestionsInput, listQuizzesInput } from '~/shared/quiz'

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

  listQuestions: userIsInGroup
    .input(listQuestionsInput)
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

  addQuestion: userIsInGroup
    .input(addQuestionInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.$transaction(async (prisma) => {
          const qn = await prisma.question.create({
            data: {
              content: input.content,
              description: input.description,
              points: input.points,
              type: input.type,
              quizId: input.quizId,
            },
            select: defaultQuestionSelect,
          })

          switch (input.type) {
            case QuestionType.File:
              return await prisma.fileQuestion.create({
                data: {
                  id: qn.id,
                },
              })

            case QuestionType.Options:
              return await prisma.optionsQuestion.create({
                data: {
                  id: qn.id,
                  options: input.options,
                  correctOptions: input.correctOptions,
                },
              })

            case QuestionType.Text:
              return await prisma.textQuestion.create({
                data: {
                  id: qn.id,
                  answer: input.answer,
                },
              })
          }
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
})
