import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateGroupInput } from '~/shared/group'

export function useGroups() {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['group', 'list'],
    queryFn: () => $client.group.list.query(),
  })
}

export function useGroup(groupId: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['group', 'get', groupId],
    queryFn: () => $client.group.get.query({ groupId }),
  })
}

export function useCreateGroupMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (group: CreateGroupInput) => $client.group.create.mutate(group),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['group', 'list'] })
    },
  })
}

export function useDeleteGroupMutation(groupId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => $client.group.delete.mutate({ groupId }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['group', 'list'] })
    },
  })
}
