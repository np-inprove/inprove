import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateInstitutionInput, DeleteInstitutionInput, UpdateInstitutionInput } from '~/shared/institution'
import type { DefaultInstitution, TRPCClientError } from '~/shared/types'

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
