import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateQuizInput } from 'shared/quiz'

export function useQuizzes(groupId: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['quiz', 'list'],
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
