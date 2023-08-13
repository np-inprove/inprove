import { createQueryKeys } from '@lukemorales/query-key-factory'

export const meQueries = createQueryKeys('me', {
  info: {
    queryKey: null,
    queryFn: () => {
      const { $client } = useNuxtApp()
      return $client.me.get.query()
    },
  },
})
