import { Prisma } from '@prisma/client'

/**
 * Default selector for InstitutionInvite.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultAnswerSelect = Prisma.validator<Prisma.AnswerSelect>()({
  id: true,
  attemptId: true,
  userId: true,
  questionId: true,
})

export type DefaultAnswer = Prisma.AnswerGetPayload<{ select: typeof defaultAnswerSelect }>

// Delegated types

export const defaultTextAnswerSelect = Prisma.validator<Prisma.TextAnswerSelect>()({
  id: true,
  answer: true,
})

export type DefaultTextAnswer = Prisma.TextAnswerGetPayload<{ select: typeof defaultTextAnswerSelect }>

export const defaultFileAnswerSelect = Prisma.validator<Prisma.FileAnswerSelect>()({
  id: true,
  fileUrl: true,
})

export type DefaultFileAnswer = Prisma.FileAnswerGetPayload<{ select: typeof defaultFileAnswerSelect }>

export const defaultOptionsAnswer = Prisma.validator<Prisma.OptionsAnswerSelect>()({
  id: true,
  options: true,
})

export type DefaultOptionsAnswer = Prisma.OptionsAnswerGetPayload<{ select: typeof defaultOptionsAnswer }>
