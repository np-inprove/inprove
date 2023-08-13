import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateGroupInput } from '~/shared/group'

export const groupQueries = createQueryKeys('groups', {
  list: {
    queryKey: null,
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.group.list.query()
    },
  },

  details: (groupId: string) => ({
    queryKey: [groupId],
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.group.get.query({ groupId })
    },
  }),
})

export function useCreateGroupMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (group: CreateGroupInput) => $client.group.create.mutate(group),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: groupQueries.list.queryKey,
      })
    },
  })
}

export function useDeleteGroupMutation(groupId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => $client.group.delete.mutate({ groupId }),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: groupQueries.details(groupId).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: groupQueries.list.queryKey,
      })
    },
  })
}
