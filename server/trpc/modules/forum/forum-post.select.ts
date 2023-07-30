import { Prisma } from '@prisma/client'

/**
 * Default selector for ForumPost.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultForumPostSelect = Prisma.validator<Prisma.ForumPostSelect>()({
  id: true,
  title: true,
  content: true,
  authorId: true,
  timestamp: true,
  forumId: true,
})

export type DefaultForumPost = Prisma.ForumPostGetPayload<{ select: typeof defaultForumPostSelect }>
