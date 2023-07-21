import { Prisma } from '@prisma/client'
import { defaultUserSelect } from '../user/user.select'
import { defaultForumSelect } from './forum.select'

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
  author: {
    select: defaultUserSelect,
  },
  forumId: true,
  forum: {
    select: defaultForumSelect,
  },
})

type DefaultForumPost = Prisma.ForumPostGetPayload<{ select: typeof defaultForumPostSelect }>
