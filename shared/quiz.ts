import { QuestionType } from '@prisma/client'
import { z } from 'zod'

export const baseQuizInput = z.object({
  groupId: z.string().cuid(),
})

export const listQuizzesInput = baseQuizInput.extend({})

export const getQuizInput = baseQuizInput.extend({
  quizId: z.string().cuid(),
})

export type ListQuizInput = z.infer<typeof listQuizzesInput>

export const createQuizInput = baseQuizInput.extend({
  name: z.string().min(1),
  description: z.string(),
})

export type CreateQuizInput = z.infer<typeof createQuizInput>

export const baseQuestionInput = baseQuizInput.extend({
  quizId: z.string().cuid(),
})

export const listQuestionsInput = baseQuestionInput.extend({})

export type ListQuestionsInput = z.infer<typeof listQuestionsInput>

// Add question
export const baseAddQuestionInput = baseQuestionInput.extend({
  content: z.string().min(1),
  description: z.string(),
  points: z.number().min(1),
})
export const addFileQuestionInput = baseAddQuestionInput.extend({
  type: z.literal(QuestionType.File),
})
export const addTextQuestionInput = baseAddQuestionInput.extend({
  type: z.literal(QuestionType.Text),
  answer: z.string().min(1),
})
export const addOptionsQuestionInput = baseAddQuestionInput.extend({
  type: z.literal(QuestionType.Options),
  options: z.array(z.string().min(1)),
  correctOptions: z.array(z.number().int().min(0)),
})

export const addQuestionInput = z.discriminatedUnion('type', [
  addFileQuestionInput,
  addTextQuestionInput,
  addOptionsQuestionInput,
]).refine((value) => {
  if (value.type !== QuestionType.Options)
    return true
  return value.correctOptions.every(i => i < value.options.length)
})

export type AddQuestionInput = z.infer<typeof addQuestionInput>
