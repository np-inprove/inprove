import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import type { CreateQuizInput } from 'shared/quiz'

export const group = createQueryKeys('group', {
  details: (groupId: string) => ({
    queryKey: [groupId],
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.group.get.query({ groupId })
    },
    contextQueries: {
      quizzes: {
        queryKey: null,
        queryFn: () => {
          const { $client } = useNuxtApp()
          return $client.quiz.list.query({ groupId })
        },
      },
    },
  }),
})

export function useQuizzes(groupId: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['quiz'],
    queryFn: () => $client.quiz.list.query({ groupId }),
  })
}

export function useCreateQuizMutation(groupId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quiz: Omit<CreateQuizInput, 'groupId'>) => $client.quiz.create.mutate({ ...quiz, groupId }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['quiz', 'list'] })
    },
  })
}

export function useQuestions(groupId: string, quizId: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['question', 'list', groupId, quizId],
    queryFn: () => $client.quiz.listQuestions.query({ groupId, quizId }),
  })
}
