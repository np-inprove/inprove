import { z } from 'zod'

export const userSessionData = z.object({
  id: z.string(),
})

export type UserSessionData = z.infer<typeof userSessionData>
