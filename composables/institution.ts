import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { AcceptInstitutionInviteInput, CreateInstitutionInput, CreateInstitutionInviteInput, DeleteInstitutionInput, DeleteInstitutionInviteInput, UpdateInstitutionInput } from '~/shared/institution'
import type { DefaultUser, TRPCClientError } from '~/shared/types'

export function useInstitutions() {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['institution', 'list'],
    queryFn: () => $client.institution.list.query(),
  })
}

export function useInstitutionInvites(institutionId: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['institutionInvite', institutionId],
    queryFn: () => $client.institutionInvite.list.query({ institutionId }),
  })
}

export function useCreateInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (institution: CreateInstitutionInput) => $client.institution.create.mutate(institution),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['institution', 'list'] })
    },
  })
}

export function useUpdateInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (institution: UpdateInstitutionInput) => $client.institution.update.mutate(institution),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['institution', 'list'] })
    },
  })
}

export function useDeleteInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (institution: DeleteInstitutionInput) => $client.institution.delete.mutate(institution),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['institution', 'list'] })
    },
  })
}

// Since we don't have information on the new institution, this is not an optimistic update
export function useAcceptInstitutionInviteMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultUser,
    TRPCClientError,
    AcceptInstitutionInviteInput
  >({
    mutationFn: invite => $client.institutionInvite.accept.mutate(invite),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useCreateInstitutionInviteMutation(institutionId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: Omit<CreateInstitutionInviteInput, 'institutionId'>) =>
      $client.institutionInvite.create.mutate({
        ...invite,
        institutionId,
      }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['institutionInvite', institutionId] })
    },
  })
}

export function useDeleteInstitutionInviteMutation(institutionId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invite: Omit<DeleteInstitutionInviteInput, 'institutionId'>) => $client.institutionInvite.delete.mutate({
      ...invite,
      institutionId,
    }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['institutionInvite', institutionId] })
    },
  })
}
