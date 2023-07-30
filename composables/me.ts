import { useQuery } from '@tanstack/vue-query'

export function useMe() {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['me'],
    queryFn: () => $client.me.get.query(),
  })
}
