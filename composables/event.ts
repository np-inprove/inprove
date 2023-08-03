import { useQuery } from '@tanstack/vue-query'

export function useUpcomingEvents(groupId: string) {
  const { $client } = useNuxtApp()
  return useQuery({
    queryKey: ['event', 'upcoming', groupId],
    queryFn: () => $client.event.upcoming.query({ groupId }),
  })
}
