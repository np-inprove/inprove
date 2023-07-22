import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateInstitutionInput, CreateInstitutionInviteInput, DeleteInstitutionInput, DeleteInstitutionInviteInput, UpdateInstitutionInput } from '~/shared/institution'
import type { DefaultInstitution, DefaultInstitutionInvite, TRPCClientError } from '~/shared/types'

export function useInstitutions() {
  const { $client } = useNuxtApp()
  return useQuery({
    queryKey: ['institutions'],
    queryFn: () => $client.institution.list.query(),
  })
}

export function useCreateInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultInstitution,
    TRPCClientError,
    CreateInstitutionInput,
    { previousInstitutions?: DefaultInstitution[] }
  >({
    mutationFn: institution => $client.institution.create.mutate(institution),
    async onMutate(newInstitution) {
      await queryClient.cancelQueries({ queryKey: ['institutions'] })
      const previousInstitutions = queryClient.getQueryData<DefaultInstitution[]>(['institutions'])
      queryClient.setQueryData<DefaultInstitution[]>(['institutions'], old => [...old!, {
        ...newInstitution,
        id: 'Generating...',
      }])

      return { previousInstitutions }
    },
    onError(_, __, context) {
      queryClient.setQueryData<DefaultInstitution[]>(['institutions'], context?.previousInstitutions)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['institutions'] })
    },
  })
}

export function useUpdateInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultInstitution,
    TRPCClientError,
    UpdateInstitutionInput,
    { previousInstitutions?: DefaultInstitution[] }
  >({
    mutationFn: institution => $client.institution.update.mutate(institution),
    async onMutate(newInstitution) {
      await queryClient.cancelQueries({ queryKey: ['institutions'] })
      const previousInstitutions = queryClient.getQueryData<DefaultInstitution[]>(['institutions'])
      queryClient.setQueryData<DefaultInstitution[]>(['institutions'], old => old!.map((institution) => {
        if (institution.id === newInstitution.id)
          return newInstitution
        return institution
      }))

      return { previousInstitutions }
    },
    onError(_, __, context) {
      queryClient.setQueryData<DefaultInstitution[]>(['institutions'], context?.previousInstitutions)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['institutions'] })
    },
  })
}

export function useDeleteInstitutionMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultInstitution,
    TRPCClientError,
    DeleteInstitutionInput,
    { previousInstitutions?: DefaultInstitution[] }
  >({
    mutationFn: institution => $client.institution.delete.mutate(institution),
    async onMutate(deletedInstitution) {
      await queryClient.cancelQueries({ queryKey: ['institutions'] })
      const previousInstitutions = queryClient.getQueryData<DefaultInstitution[]>(['institutions'])
      queryClient.setQueryData<DefaultInstitution[]>(['institutions'], old => old!.filter(institution => institution.id !== deletedInstitution.id))

      return { previousInstitutions }
    },
    onError(_, __, context) {
      queryClient.setQueryData<DefaultInstitution[]>(['institutions'], context?.previousInstitutions)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['institutions'] })
    },
  })
}

export function useCreateInstitutionInviteMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultInstitutionInvite,
    TRPCClientError,
    CreateInstitutionInviteInput,
    { previousInvites?: DefaultInstitutionInvite[] }
  >({
    mutationFn: invite => $client.institutionInvite.create.mutate(invite),
    async onMutate(newInvite) {
      await queryClient.cancelQueries({ queryKey: ['institutions', newInvite.institutionId, 'invites'] })
      const previousInvites = queryClient.getQueryData<DefaultInstitutionInvite[]>(['institutions', newInvite.institutionId, 'invites'])
      queryClient.setQueryData<DefaultInstitutionInvite[]>(['institutions', newInvite.institutionId, 'invites'], old => [...old!, {
        ...newInvite,
        id: 'Generating...',
      }])

      return { previousInvites }
    },
    onError(_, vars, context) {
      queryClient.setQueryData<DefaultInstitutionInvite[]>(['institutions', vars.institutionId, 'invites'], context?.previousInvites)
    },
    onSettled(_, __, vars) {
      queryClient.invalidateQueries({ queryKey: ['institutions', vars.institutionId, 'invites'] })
    },
  })
}

export function useDeleteInstitutionInviteMutation() {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultInstitutionInvite,
    TRPCClientError,
    DeleteInstitutionInviteInput,
    { previousInvites?: DefaultInstitutionInvite[] }
  >({
    mutationFn: invite => $client.institutionInvite.delete.mutate(invite),
    async onMutate(deletedInvite) {
      await queryClient.cancelQueries({ queryKey: ['institutions', deletedInvite.institutionId, 'invites'] })
      const previousInvites = queryClient.getQueryData<DefaultInstitutionInvite[]>(['institutions', deletedInvite.institutionId, 'invites'])
      queryClient.setQueryData<DefaultInstitutionInvite[]>(['institutions', deletedInvite.institutionId, 'invites'], old => old?.filter(invite => invite.id !== deletedInvite.inviteId))

      return { previousInvites }
    },
    onError(_, vars, context) {
      queryClient.setQueryData<DefaultInstitutionInvite[]>(['institutions', vars.institutionId, 'invites'], context?.previousInvites)
    },
    onSettled(_, __, vars) {
      queryClient.invalidateQueries({ queryKey: ['institutions', vars.institutionId, 'invites'] })
    },
  })
}
