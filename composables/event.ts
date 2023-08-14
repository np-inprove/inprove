import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateEventInput, DeleteEventInput, UpdateEventInput } from '~/shared/event'

// TODO migrate to useInfiniteQuery
export function useUpcomingEvents(groupId: string, date?: Ref<Date | undefined>) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['event', 'upcoming', groupId, date],
    queryFn: () => $client.event.upcoming.query({ groupId, date: date?.value }),
  })
}

export function useCreateEventMutation(groupId: string) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (event: Omit<CreateEventInput, 'groupId'>) => $client.event.create.mutate({
      groupId,
      ...event,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['event', 'upcoming'])
    },
  })
}

export function useUpdateEventMutation(groupId: string) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (event: Omit<UpdateEventInput, 'groupId'>) => $client.event.update.mutate({
      groupId,
      ...event,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['event', 'upcoming'])
    },
  })
}

export function useDeleteEventMutation(groupId: string) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (event: Omit<DeleteEventInput, 'groupId'>) => $client.event.delete.mutate({
      groupId,
      ...event,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['event', 'upcoming'])
    },
  })
}
