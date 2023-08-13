import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateQuizInput } from 'shared/quiz'

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

    // contextQueries: {
    //   questions: {
    //     queryKey: ['questions'],
    //     queryFn: () => {
    //       const { $client } = useNuxtApp()
    //       return $client.quiz.listQuestions.query({ quizId })
    //     },
    //   },
    // },
  }),
})

export function useCreateQuizMutation(groupId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quiz: Omit<CreateQuizInput, 'groupId'>) => $client.quiz.create.mutate({ ...quiz, groupId }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: quizzesQueries.list(groupId).queryKey })
    },
  })
}

export function useQuestions(groupId: string, quizId: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['question', 'list', groupId, quizId],
  })
}
