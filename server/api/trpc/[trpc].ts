import { createNuxtApiHandler } from 'trpc-nuxt'
import { appRouter } from '../../trpc/modules'
import { createContext } from '~/server/trpc/context'

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext,
})
