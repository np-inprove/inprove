import type { UseQueryOptions } from '@tanstack/vue-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateGroupInput } from '~/shared/group'
import type { DefaultGroup, TRPCClientError } from '~/shared/types'

type UseGroupsUseQueryOptions = UseQueryOptions<DefaultGroup[], Error>

export function useGroups(opts?: Omit<UseGroupsUseQueryOptions, 'queryKey' | 'queryFn'>) {
  const { $client } = useNuxtApp()

  return useQuery<DefaultGroup[], Error>({
    queryKey: ['groups'],
    queryFn: () => $client.group.list.query(),
    ...opts,
  })
}

export function useGroup(id: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['groups', id],
    queryFn: () => $client.group.get.query({ groupId: id }),
  })
}

export function useCreateGroupMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultGroup,
    TRPCClientError,
    CreateGroupInput,
    { previousGroups?: DefaultGroup[] }
  >({
    mutationFn: group => $client.group.create.mutate(group),
    async onMutate(newGroup) {
      await queryClient.cancelQueries({ queryKey: ['groups'] })
      const previousGroups = queryClient.getQueryData<DefaultGroup[]>(['groups'])
      queryClient.setQueryData<DefaultGroup[]>(['groups'], old => [...old!, {
        ...newGroup,
        id: 'Generating...',
      }])

      return { previousGroups }
    },
    onError(_, __, context) {
      queryClient.setQueryData<DefaultGroup[]>(['groups'], context?.previousGroups)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}
