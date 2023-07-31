import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateDeadlineInput, DeleteDeadlineInput, UpdateDeadlineInput, UpvoteDeadlineInput } from '~/shared/deadline'

export function useDeadlines(groupId: string) {
  const { $client } = useNuxtApp()
  return useQuery({
    queryKey: ['deadline', 'list', groupId],
    queryFn: () => $client.deadline.list.query({ groupId }),
  })
}

export function useCreateDeadlineMutation(groupId: string) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (deadline: Omit<CreateDeadlineInput, 'groupId'>) => $client.deadline.create.mutate({
      groupId,
      ...deadline,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['deadline', 'list', groupId])
    },
  })
}

export function useUpdateDeadlineMutation(groupId: string) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (deadline: Omit<UpdateDeadlineInput, 'groupId'>) => $client.deadline.update.mutate({
      groupId,
      ...deadline,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['deadline', 'list', groupId])
    },
  })
}

export function useUpvoteDeadlineMutation(groupId: string) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (deadline: Omit<UpvoteDeadlineInput, 'groupId'>) => $client.deadline.upvote.mutate({
      groupId,
      ...deadline,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['deadline', 'list', groupId])
    },
  })
}

export function useDownvoteDeadlineMutation(groupId: string) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (deadline: Omit<UpvoteDeadlineInput, 'groupId'>) => $client.deadline.downvote.mutate({
      groupId,
      ...deadline,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['deadline', 'list', groupId])
    },
  })
}

export function useDeleteDeadlineMutation(groupId: string) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (deadline: Omit<DeleteDeadlineInput, 'groupId'>) => $client.deadline.upvote.mutate({
      groupId,
      ...deadline,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['deadline', 'list', groupId])
    },
  })
}
