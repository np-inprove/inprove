import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { BulkUpsertQuestionInput, CreateQuizInput } from '~/shared/quiz'

export const quizzesQueries = createQueryKeys('quizzes', {
  list: (groupId: string) => ({
    queryKey: [groupId],
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.quiz.list.query({ groupId })
    },
  }),

  details: (quizId: string) => ({
    queryKey: [quizId],
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.quiz.get.query({ quizId })
    },

    contextQueries: {
      questions: {
        queryKey: ['questions'],
        queryFn: () => {
          const { $client } = useNuxtApp()
          return $client.quiz.listQuestions.query({ quizId })
        },
      },
    },
  }),
})

export function useCreateQuizMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quiz: CreateQuizInput) => $client.quiz.create.mutate(quiz),
    onSuccess(_, vars) {
      queryClient.invalidateQueries({ queryKey: quizzesQueries.list(vars.groupId).queryKey })
    },
  })
}

export function useBulkUpsertQuestionsMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (qns: BulkUpsertQuestionInput) => $client.quiz.bulkUpsertQuestions.mutate(qns),
    onSuccess() {
      // queryClient.invalidateQueries({ queryKey: quizzesQueries.list(groupId).queryKey })
    },
  })
}
