import { z } from 'zod'

export const listForumInput = z.object({
  groupId: z.string().cuid(),
})

export const getForumInput = z.object({
  forumId: z.string().cuid(),
})

export const createForumPostInput = z.object({
  groupId: z.string().cuid(),
})

export type ListForumInput = z.infer<typeof listForumInput>
export type GetForumInput = z.infer<typeof getForumInput>
export type CreateForumInput = z.infer<typeof createForumPostInput>
