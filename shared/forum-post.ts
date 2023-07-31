import { z } from 'zod'
import { paginator } from './pagination'

export const baseForumPostInput = z.object({
  forumId: z.string().cuid(),
})

export const listForumPostInput = baseForumPostInput.extend({
  parentId: z.string().cuid().optional(),
  paginator: paginator.optional(),
})

export const getForumPostInput = baseForumPostInput.extend({
  postId: z.string().cuid(),
})

export const createForumPostInput = baseForumPostInput.extend({
  parentId: z.string().cuid().optional(),
  title: z.string(),
  content: z.string().nonempty(),
})

export const reactForumPostInput = baseForumPostInput.extend({
  postId: z.string().cuid(),
  emoji: z.string().min(1).max(2).emoji(),
})

export type ListForumPostInput = z.infer<typeof listForumPostInput>
export type CreateForumPostInput = z.infer<typeof createForumPostInput>
export type ReactForumPostInput = z.infer<typeof reactForumPostInput>
