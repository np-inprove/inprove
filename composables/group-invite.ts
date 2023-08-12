import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateGroupInviteInput, DeleteGroupInviteInput } from '~/shared/group-invite'

export const groupInviteQueries = createQueryKeys('groupInvites', {
  list: (groupId: string) => ({
    queryKey: [groupId],
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.group.invites.list.query({ groupId })
    },
  }),

  details: (inviteId: string) => ({
    queryKey: [inviteId],
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.group.invites.get.query({ inviteId })
    },
  }),
})

export function useCreateGroupInviteMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: CreateGroupInviteInput) => $client.group.invites.create.mutate(invite),
    onSuccess(_, vars) {
      queryClient.invalidateQueries({ queryKey: groupInviteQueries.list(vars.groupId).queryKey })
    },
  })
}

export function useDeleteGroupInviteMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: DeleteGroupInviteInput) => $client.group.invites.delete.mutate(invite),
    onSuccess(_, vars) {
      queryClient.invalidateQueries({ queryKey: groupInviteQueries.list(vars.groupId).queryKey })
    },
  })
}
