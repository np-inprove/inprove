import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { AcceptInstitutionInviteInput, CreateInstitutionInput, DeleteInstitutionInput, UpdateInstitutionInput } from '~/shared/institution'

export const institutionQueries = createQueryKeys('institutions', {
  list: {
    queryKey: null,
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.institution.list.query()
    },
  },
})

export function useCreateInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (institution: CreateInstitutionInput) => $client.institution.create.mutate(institution),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: institutionQueries.list.queryKey })
    },
  })
}

export function useUpdateInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (institution: UpdateInstitutionInput) => $client.institution.update.mutate(institution),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: institutionQueries.list.queryKey })
    },
  })
}

export function useDeleteInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (institution: DeleteInstitutionInput) => $client.institution.delete.mutate(institution),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: institutionQueries.list.queryKey })
    },
  })
}

// Since we don't have information on the new institution, this is not an optimistic update
export function useAcceptInstitutionInviteMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: AcceptInstitutionInviteInput) => $client.institutionInvite.accept.mutate(invite),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: meQueries.info.queryKey })
    },
  })
}
