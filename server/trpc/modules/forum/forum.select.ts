import { Prisma } from '@prisma/client'

/**
 * Default selector for Forum.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
export const defaultForumSelect = Prisma.validator<Prisma.ForumSelect>()({
  id: true,
  name: true,
  description: true,
})

export type DefaultForum = Prisma.ForumGetPayload<{ select: typeof defaultForumSelect }>
