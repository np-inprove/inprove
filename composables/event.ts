import { useQuery } from '@tanstack/vue-query'

export function useUpcomingEvents(groupId: string, date?: Ref<Date | undefined>) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['event', 'upcoming', groupId, date],
    queryFn: () => $client.event.upcoming.query({ groupId, date: date?.value }),
  })
}
