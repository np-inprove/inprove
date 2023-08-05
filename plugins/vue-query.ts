import type { DehydratedState, VueQueryPluginOptions } from '@tanstack/vue-query'

// Nuxt 3 app aliases
import { useState } from '#app'

export default defineNuxtPlugin({
  parallel: true,
  async setup(nuxt) {
    const { QueryClient, VueQueryPlugin, dehydrate, hydrate } = await import('@tanstack/vue-query')

    const vueQueryState = useState<DehydratedState | null>('vue-query')

    // Modify your Vue Query global settings here
    const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: 30000 } },
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
