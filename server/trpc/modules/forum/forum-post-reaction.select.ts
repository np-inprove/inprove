import { Prisma } from '@prisma/client'

/**
 * Default selector for ForumPostReaction.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultForumPostReactionSelect = Prisma.validator<Prisma.ForumPostReactionSelect>()({
  id: true,
  postId: true,
  userId: true,
  emoji: true,
})

export type DefaultForumPostReaction = Prisma.ForumPostReactionGetPayload<{ select: typeof defaultForumPostReactionSelect }>
