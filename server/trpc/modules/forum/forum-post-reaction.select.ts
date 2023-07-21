import { Prisma } from '@prisma/client'
import { defaultUserSelect } from '../user/user.select'
import { defaultForumPostSelect } from './forum-post.select'

/**
 * Default selector for ForumPostReaction.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultForumPostReactionSelect = Prisma.validator<Prisma.ForumPostReactionSelect>()({
  id: true,
  postId: true,
  post: {
    select: defaultForumPostSelect,
  },
  userId: true,
  user: {
    select: defaultUserSelect,
  },
  emoji: true,
})

type DefaultForumPostReaction = Prisma.ForumPostReactionGetPayload<{ select: typeof defaultForumPostReactionSelect }>
