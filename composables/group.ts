import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AcceptGroupInviteInput } from '~/shared/group-invite'
import type { CreateGroupInput, RemoveGroupUserInput, UpdateGroupInput } from '~/shared/group'

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

export function useUpdateGroupMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (group: UpdateGroupInput) => $client.group.update.mutate(group),
    onSuccess(_, vars) {
      queryClient.invalidateQueries({
        queryKey: groupQueries.details(vars.groupId).queryKey,
      })
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

export function useAcceptGroupInviteLinkMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: AcceptGroupInviteInput) => $client.group.invites.accept.mutate(invite),
    onSuccess(_, vars) {
      queryClient.invalidateQueries({ queryKey: groupInviteQueries.list(vars.inviteId).queryKey })
    },
  })
}

export const groupUsersQueries = createQueryKeys('groupUsers', {
  list: (groupId: string) => ({
    queryKey: [groupId],
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.group.users.list.query({ groupId })
    },
  }),
})

export function useRemoveGroupUserMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user: RemoveGroupUserInput) => $client.group.users.remove.mutate(user),
    onSuccess(_, vars) {
      queryClient.invalidateQueries({ queryKey: groupUsersQueries.list(vars.groupId).queryKey })
    },
  })
}
