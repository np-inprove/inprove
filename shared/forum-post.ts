import { z } from 'zod'
import { paginator } from './pagination'

export const baseForumPostInput = z.object({
  forumId: z.string().cuid(),
})

export const listForumPostInput = baseForumPostInput.extend({
  forumId: z.string(),
  parentId: z.string().cuid().optional(),
  paginator: paginator.optional(),
})

export const createForumPostInput = baseForumPostInput.extend({
  forumId: z.string().cuid(),
  parentId: z.string().cuid().optional(),
  title: z.string().nonempty(),
  content: z.string().nonempty(),
})

export type ListForumPostInput = z.infer<typeof listForumPostInput>
export type CreateForumPostInput = z.infer<typeof createForumPostInput>
