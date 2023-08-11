import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateGroupInviteInput, DeleteGroupInviteInput } from '~/shared/group-invite'

export function useGroupInvites(groupId?: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['group', 'invites', 'list', { groupId }],
    queryFn: () => $client.group.invites.list.query({ groupId: groupId! }),
    enabled: !!groupId,
  })
}

export function useGroupInvite(inviteId?: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['group', 'invites', 'get', { inviteId }],
    queryFn: () => $client.group.invites.get.query({ inviteId: inviteId! }),
    enabled: !!inviteId,
  })
}

export function useCreateGroupInviteMutation(groupId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: Omit<CreateGroupInviteInput, 'groupId'>) =>
      $client.group.invites.create.mutate({
        ...invite,
        groupId,
      }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['group', 'invites', 'list', { groupId }] })
    },
  })
}

export function useDeleteGroupInviteMutation(groupId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: Omit<DeleteGroupInviteInput, 'groupId'>) => $client.group.invites.delete.mutate({
      ...invite,
      groupId,
    }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['group', 'invites', 'list', { groupId }] })
    },
  })
}
