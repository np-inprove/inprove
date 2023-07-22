import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { InstitutionRole } from '@prisma/client'
import { assertInstitutionRole } from '../rbac'
import { defaultInstitutionSelect } from './institution.select'
import { defaultInstitutionInviteSelect } from './institution-invite.select'
import { createInstitutionInviteInput, deleteInstitutionInviteInput } from '~/shared/institution'
import { protectedProcedure, router } from '~/server/trpc/trpc'

const baseProcedure = protectedProcedure.input(
  z.object({
    institutionId: z.string().cuid(),
  }),
).use(async ({ next, ctx, input }) => {
  try {
    const institution = await ctx.prisma.institution.findUnique({
      where: { id: input.institutionId },
      select: defaultInstitutionSelect,
    })

    if (!institution) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Institution not found',
      })
    }

    if (!ctx.session.user.admin && ctx.session.user.institution?.id !== institution.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User is not in institution',
      })
    }

    return next({
      ctx: {
        ...ctx,
        institution,
      },
    })
  }
  catch (err) {
    ctx.logger.error({ err, msg: 'failed to authorize institution request' })
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
    })
  }
})

export const institutionInviteRouter = router({
  list: baseProcedure
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user.admin)
        assertInstitutionRole(ctx.session.user, [InstitutionRole.Admin, InstitutionRole.Educator])

      try {
        return await ctx.prisma.institutionInvite.findMany({
          where: { institutionId: input.institutionId },
          select: defaultInstitutionInviteSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to list institution invites' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to list institution invites',
        })
      }
    }),

  create: baseProcedure
    .input(createInstitutionInviteInput)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin)
        assertInstitutionRole(ctx.session.user, [InstitutionRole.Admin, InstitutionRole.Educator])

      try {
        return await ctx.prisma.institutionInvite.create({
          data: {
            role: input.role,
            institutionId: input.institutionId,
          },
          select: defaultInstitutionInviteSelect,
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to create institution invite' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create institution invite',
        })
      }
    }),

  delete: baseProcedure
    .input(deleteInstitutionInviteInput)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin)
        assertInstitutionRole(ctx.session.user, [InstitutionRole.Admin, InstitutionRole.Educator])

      const invite = await ctx.prisma.institutionInvite.findUnique({
        where: { id: input.inviteId },
      })

      if (invite === null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Institution invite does not exist',
        })
      }

      if (invite.institutionId !== input.institutionId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }

      try {
        return await ctx.prisma.institutionInvite.delete({
          where: { id: input.inviteId },
        })
      }
      catch (err) {
        ctx.logger.error({ err, msg: 'failed to delete institution invite' })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete institution invite',
        })
      }
    }),

})

// export type definition of API
export type InstitutionInviteRouter = typeof institutionInviteRouter
