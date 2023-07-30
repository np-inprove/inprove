import { TRPCError } from '@trpc/server'
import { defaultForumPostSelect } from './forum-post.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { baseForumPostInput, createForumPostInput, listForumPostInput } from '~/shared/forum-post'

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
          select: defaultForumPostSelect,
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

  create: userIsInGroup
    .input(createForumPostInput)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.forumPost.create({
          data: {
            forumId: input.forumId,
            parentId: input.parentId,
            title: input.title,
            content: input.content,
          },
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
})
