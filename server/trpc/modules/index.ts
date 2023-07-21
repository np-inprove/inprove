import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { authRouter } from './auth/auth.router'
import { meRouter } from './me/me.router'

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
        time: new Date(),
      }
    }),
  auth: authRouter,
  me: meRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
