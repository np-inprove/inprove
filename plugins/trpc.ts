import type { AppRouter } from '~/server/trpc/modules'

export default defineNuxtPlugin({
  parallel: true,
  async setup() {
    const { createTRPCNuxtClient, httpBatchLink } = await import('trpc-nuxt/client')
    const { default: superjson } = await import('superjson')

    /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
    const client = createTRPCNuxtClient<AppRouter>({
      transformer: superjson,
      links: [
        httpBatchLink(),
      ],
    })

    return {
      provide: {
        client,
      },
    }
  },
})
