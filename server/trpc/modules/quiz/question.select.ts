import { Prisma } from '@prisma/client'

/**
 * Default selector for InstitutionInvite.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultQuestionSelect = Prisma.validator<Prisma.QuestionSelect>()({
  id: true,
  content: true,
  description: true,
  points: true,
  type: true,
  quizId: true,
})

export type DefaultQuestion = Prisma.QuestionGetPayload<{ select: typeof defaultQuestionSelect }>

// Delegated types

export const defaultTextQuestionSelect = Prisma.validator<Prisma.TextQuestionSelect>()({
  id: true,
  answer: true,
})

export type DefaultTextQuestion = Prisma.TextQuestionGetPayload<{ select: typeof defaultTextQuestionSelect }>

export const defaultFileQuestionSelect = Prisma.validator<Prisma.FileQuestionSelect>()({
  id: true,
})

export type DefaultFileQuestion = Prisma.FileQuestionGetPayload<{ select: typeof defaultFileQuestionSelect }>

export const defaultOptionsQuestionSelect = Prisma.validator<Prisma.OptionsQuestionSelect>()({
  id: true,
  options: true,
  correctOptions: true,
})

export type DefaultOptionsQuestion = Prisma.OptionsQuestionGetPayload<{ select: typeof defaultOptionsQuestionSelect }>
