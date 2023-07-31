import { TRPCError } from '@trpc/server'
import { defaultUserSelect } from '../user/user.select'
import { defaultForumPostSelect } from './forum-post.select'
import { defaultForumPostReactionSelect } from './forum-post-reaction.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { baseForumPostInput, createForumPostInput, getForumPostInput, listForumPostInput, reactForumPostInput } from '~/shared/forum-post'

const userIsInGroup = protectedProcedure
  .input(baseForumPostInput)
  .use(async ({ next, ctx, input }) => {
    try {
      const group = await ctx.prisma.forum.findUnique({
        where: {
          id: input.forumId,
          group: {
            users: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      })

      // TODO caught locally
      if (group === null) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      return next({
        ctx: {
          group,
        },
      })
    }
    catch (err) {
      ctx.logger.error({ msg: 'failed to verify user in group', err })
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to list forum posts',
      })
    }
  })

export const forumPostRouter = router({
  list: userIsInGroup
    .input(listForumPostInput)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.forumPost.findMany({
          where: {
            forumId: input.forumId,
            parentId: input.parentId,
          },
          orderBy: {
            timestamp: 'desc',
          },
          cursor: input.paginator?.cursor
            ? {
                id: input.paginator.cursor,
              }
            : undefined,
          take: input.paginator?.take,
          select: {
            ...defaultForumPostSelect,
            author: {
              select: defaultUserSelect,
            },
          },
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to list forum posts', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list forum posts',
        })
      }
    }),

  get: userIsInGroup
    .input(getForumPostInput)
    .query(async ({ ctx, input }) => {
      try {
        // TODO don't throw, handle properly
        const [data, reactionsAggregate, currentReaction] = await Promise.all([
          ctx.prisma.forumPost.findUniqueOrThrow({
            where: {
              id: input.postId,
              forumId: input.forumId,
            },
            select: defaultForumPostSelect,
          }),
          ctx.prisma.forumPostReaction.groupBy({
            by: ['emoji'],
            where: {
              postId: input.postId,
            },
            _count: {
              emoji: true,
            },
          }),
          ctx.prisma.forumPostReaction.findUnique({
            where: {
              postId_userId: {
                postId: input.postId,
                userId: ctx.session.user.id,
              },
            },
          }),
        ])

        return {
          ...data,
          reactionsAggregate,
          currentReaction,
        }
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to create forum posts', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create forum posts',
        })
      }
    }),

  create: userIsInGroup
    .input(createForumPostInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.forumPost.create({
          data: {
            authorId: ctx.session.user.id,
            forumId: input.forumId,
            parentId: input.parentId,

            title: input.title,
            content: input.content,
          },
          select: defaultForumPostSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to create forum posts', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create forum posts',
        })
      }
    }),

  react: userIsInGroup
    .input(reactForumPostInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.forumPostReaction.upsert({
          where: {
            postId_userId: {
              postId: input.postId,
              userId: ctx.session.user.id,
            },
          },
          update: {
            emoji: input.emoji,
          },
          create: {
            emoji: input.emoji,
            postId: input.postId,
            userId: ctx.session.user.id,
          },
          select: defaultForumPostReactionSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ msg: 'failed to react to forum post', err })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to react to forum post',
        })
      }
    }),
})
