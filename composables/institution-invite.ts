import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useQueryClient } from '@tanstack/vue-query'
import type { CreateInstitutionInviteInput, DeleteInstitutionInviteInput } from '~/shared/institution'

export const institutionInviteQueries = createQueryKeys('institutionInvites', {
  list: (institutionId: string) => ({
    queryKey: [institutionId],
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.institutionInvite.list.query({ institutionId })
    },
  }),
})

export function useCreateInstitutionInviteMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: CreateInstitutionInviteInput) => $client.institutionInvite.create.mutate(invite),
    onSuccess(_, vars) {
      queryClient.invalidateQueries({ queryKey: institutionInviteQueries.list(vars.institutionId).queryKey })
    },
  })
}

export function useDeleteInstitutionInviteMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: DeleteInstitutionInviteInput) => $client.institutionInvite.delete.mutate(invite),
    onSuccess(_, vars) {
      queryClient.invalidateQueries({ queryKey: institutionInviteQueries.list(vars.institutionId).queryKey })
    },
  })
}
