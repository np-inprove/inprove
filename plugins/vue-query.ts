import { type DehydratedState, QueryCache, type VueQueryPluginOptions } from '@tanstack/vue-query'

// Nuxt 3 app aliases
import { TRPCClientError } from '@trpc/client'
import { useState } from '#app'

export default defineNuxtPlugin({
  parallel: true,
  async setup(nuxt) {
    const { QueryClient, VueQueryPlugin, dehydrate, hydrate } = await import('@tanstack/vue-query')

    const vueQueryState = useState<DehydratedState | null>('vue-query')

    // Modify your Vue Query global settings here
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 30000,
          retry(_, err) {
            if (err instanceof TRPCClientError) {
              if (err.data.code === 'UNAUTHORIZED' || err.data.code === 'FORBIDDEN')
                return false
            }
            return true
          },
        },
      },
      queryCache: new QueryCache({
        async onError(err) {
          if (err instanceof TRPCClientError) {
            if (err.data.code === 'UNAUTHORIZED')
              await navigateTo('/login')
            if (err.data.code === 'FORBIDDEN')
              await navigateTo('/dashboard')
          }
        },
      }),
    })
    const options: VueQueryPluginOptions = { queryClient }

    nuxt.vueApp.use(VueQueryPlugin, options)

    if (process.server) {
      nuxt.hooks.hook('app:rendered', () => {
        vueQueryState.value = dehydrate(queryClient)
      })
    }

    if (process.client) {
      nuxt.hooks.hook('app:created', () => {
        hydrate(queryClient, vueQueryState.value)
      })
    }
  },
})
