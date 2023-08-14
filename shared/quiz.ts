import { z } from 'zod'
import { QuestionType } from '~/shared/enums'

export const baseQuizInput = z.object({
  groupId: z.string().cuid(),
})

export const listQuizzesInput = baseQuizInput.extend({})

export const getQuizInput = z.object({
  quizId: z.string().cuid(),
})

export type ListQuizInput = z.infer<typeof listQuizzesInput>

export const createQuizInput = baseQuizInput.extend({
  name: z.string().min(1),
  description: z.string(),
})

export type CreateQuizInput = z.infer<typeof createQuizInput>

export const baseQuestionInput = z.object({
  quizId: z.string().cuid(),
})

export const listQuestionsInput = baseQuestionInput.extend({})

export type ListQuestionsInput = z.infer<typeof listQuestionsInput>

// Add question
export const baseAddQuestionInput = z.object({
  id: z.string().cuid().optional(),
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

export const addAnyQuestionInput = z.discriminatedUnion('type', [
  addFileQuestionInput,
  addTextQuestionInput,
  addOptionsQuestionInput,
]).refine((value) => {
  if (value.type !== QuestionType.Options)
    return true
  return value.correctOptions.every(i => i < value.options.length)
})

export const bulkUpsertQuestionInput = baseQuestionInput.extend({
  questions: z.array(addAnyQuestionInput),
})

export type BulkUpsertQuestionInput = z.infer<typeof bulkUpsertQuestionInput>

// TODO move to proper place, not necessarily used only in input. the types for this are all over the place imo.
// Need to find a time to sit down and probably refactor this.
export type AnyQuestion = z.infer<typeof addAnyQuestionInput>

export const fileQn = z.object({
  type: z.literal(QuestionType.File),
  id: z.string().cuid().optional(),
  content: z.string(),
  description: z.string(),
  points: z.number(),
})

export const optionsQn = z.object({
  type: z.literal(QuestionType.Options),
  id: z.string().cuid().optional(),
  content: z.string(),
  options: z.array(z.string()),
  correctOptions: z.array(z.number()),
  description: z.string(),
  points: z.number(),
})

export type OptionsQn = z.infer<typeof optionsQn>

export const textQn = z.object({
  type: z.literal(QuestionType.Text),
  id: z.string().cuid().optional(),
  answer: z.string(),
  content: z.string(),
  description: z.string(),
  points: z.number(),
})

export const combinedQuestion = z.discriminatedUnion('type', [
  fileQn, optionsQn, textQn,
])

export type CombinedQuestion = z.infer<typeof combinedQuestion>

export const quizState = z.object({
  questions: z.array(combinedQuestion),
})

export type QuizState = z.infer<typeof quizState>
