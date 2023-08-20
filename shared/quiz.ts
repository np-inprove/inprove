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

// TODO move to proper place, not necessarily used only in input. the types for this are all over the place imo.
// Need to find a time to sit down and probably refactor this.

export const fileQn = z.object({
  type: z.literal(QuestionType.File),
  id: z.string().cuid().optional(),
  content: z.string(),
  description: z.string(),
  points: z.number(),
})

export type FileQn = z.infer<typeof fileQn>

export const optionsQn = z.object({
  type: z.literal(QuestionType.Options),
  id: z.string().cuid().optional(),
  content: z.string(),
  options: z.array(z.string()).optional(),
  correctOptions: z.array(z.number()).optional(),
  description: z.string(),
  points: z.number(),
})

export type OptionsQn = z.infer<typeof optionsQn>

export const textQn = z.object({
  type: z.literal(QuestionType.Text),
  id: z.string().cuid().optional(),
  answer: z.string().optional().nullable(),
  content: z.string(),
  description: z.string(),
  points: z.number(),
})

export type TextQn = z.infer<typeof textQn>

export const combinedQuestion = z.discriminatedUnion('type', [
  fileQn, optionsQn, textQn,
])

export type CombinedQuestion = z.infer<typeof combinedQuestion>

export const quizState = z.object({
  questions: z.array(combinedQuestion),
})

export type QuizState = z.infer<typeof quizState>

export const bulkUpsertQuestionInput = quizState.extend({
  quizId: z.string().cuid(),
})

export type BulkUpsertQuestionInput = z.infer<typeof bulkUpsertQuestionInput>

// TODO this is for response data

export const fileAnswer = z.object({
  type: z.literal(QuestionType.File),
  url: z.string().url(),
})

// TODO "state" is for the frontend to use in order to render the UI in the respective question components.
// Different from the filAnswer object which should be used on the server for input validation
// Need to think of a good name, as usual

// TODO also need to contain the actual question option... oops
export const fileAnswerState = fileAnswer
  .extend({
    content: z.string(),
    description: z.string(),
  }).partial({
    url: true, // TODO temporary for frontend state to not throw errors
  })

export type FileAnswer = z.infer<typeof fileAnswer>
export type FileAnswerState = z.infer<typeof fileAnswerState>

export const optionsAnswer = z.object({
  type: z.literal(QuestionType.Options),
  options: z.array(z.number()),
})

export const optionsAnswerState = optionsAnswer
  .extend({
    content: z.string(),
    description: z.string(),
  }).partial({
    options: true, // TODO temporary for frontend state to not throw errors
  })

export type OptionsAnswer = z.infer<typeof optionsAnswer>
export type OptionsAnswerState = z.infer<typeof optionsAnswerState>

export const textAnswer = z.object({
  type: z.literal(QuestionType.Text),
  answer: z.string(),
})

export const textAnswerState = textAnswer
  .extend({
    content: z.string(),
    description: z.string(),
  }).partial({
    answer: true, // TODO temporary for frontend state to not throw errors
  })

export type TextAnswer = z.infer<typeof textAnswer>
export type TextAnswerState = z.infer<typeof textAnswerState>

export const combinedAnswer = z.discriminatedUnion('type', [
  fileAnswer, optionsAnswer, textAnswer,
])

export const combinedAnswerState = z.discriminatedUnion('type', [
  fileAnswerState, optionsAnswerState, textAnswerState,
])

export type CombinedAnswer = z.infer<typeof combinedAnswer>
export type CombinedAnswerState = z.infer<typeof combinedAnswerState>
