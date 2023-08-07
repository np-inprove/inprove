import { Prisma } from '@prisma/client'

/**
 * Default selector for InstitutionInvite.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultQuizSelect = Prisma.validator<Prisma.QuizSelect>()({
  id: true,
  name: true,
  description: true,
  questionOrder: true,
  authorId: true,
  groupId: true,
})

export type DefaultQuiz = Prisma.QuizGetPayload<{ select: typeof defaultQuizSelect }>
