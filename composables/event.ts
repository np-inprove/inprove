import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateEventInput } from '~/shared/event'

export function useUpcomingEvents(groupId: string, date?: Ref<Date | undefined>) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['event', 'upcoming', groupId, date],
    queryFn: () => $client.event.upcoming.query({ groupId, date: date?.value }),
  })
}

export function useCreateEventMutation(groupId: string, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const { $client } = useNuxtApp()

  return useMutation({
    mutationFn: (event: Omit<CreateEventInput, 'groupId'>) => $client.event.create.mutate({
      groupId,
      ...event,
    }),
    onSuccess() {
      queryClient.invalidateQueries(['event', 'list', groupId])
      onSuccess?.()
    },
  })
}
