import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useQuery } from '@tanstack/vue-query'

export const meQueries = createQueryKeys('me', {
  info: {
    queryKey: null,
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.me.get.query()
    },
  },
})

export function useMe() {
  return useQuery(meQueries.info)
}
