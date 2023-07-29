import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { defaultForumPostSelect } from './forum-post.select'
import { protectedProcedure, router } from '~/server/trpc/trpc'

export const forumPostRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        forumId: z.string(),
        parentId: z.string().cuid().optional(),
        pagination: z.object({
          cursor: z.string().cuid(),
          take: z.number().min(1).max(50).default(30),
        }).optional(),
      }),
    )
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
          cursor: input.pagination?.cursor
            ? {
                id: input.pagination?.cursor,
              }
            : undefined,
          take: input.pagination?.take,
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

  create: protectedProcedure
    .input(
      z.object({
        forumId: z.string().cuid(),
        parentId: z.string().cuid().optional(),
        title: z.string().nonempty(),
        content: z.string().nonempty(),
      }),
    )
    .query(async ({ ctx, input }) => {
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
