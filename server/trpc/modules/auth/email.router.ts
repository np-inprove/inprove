import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { render } from '@qingu/vue-email'
import { createSSRApp } from 'vue'

import { defaultUserSelect } from '../user/user.select'
import { VerificationError } from './auth.error'
import { verifyToken } from './auth.service'
import { createTokenHash, createVfnToken } from './email.service'

import { VerificationCodeEmail } from '~/server/emails/verification-code'
import { publicProcedure, router } from '~/server/trpc/trpc'

const admins = useRuntimeConfig().admins.split(';')

export const emailSessionRouter = router({
  // Generate OTP.
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input: { email } }) => {
      // TODO: instead of storing expires, store issuedAt to calculate when the next otp can be re-issued
      // TODO: rate limit this endpoint also
      const expires = new Date(Date.now() + useRuntimeConfig().otpExpiry * 1000)
      const token = createVfnToken()
      const hashedToken = createTokenHash(token, email)

      // May have one of them fail,
      // so users may get an email but not have the token saved, but that should be fine.
      const [_, html] = await Promise.all([
        ctx.prisma.verificationToken.upsert({
          where: {
            identifier: email,
          },
          update: {
            token: hashedToken,
            expires,
            attempts: 0,
          },
          create: {
            identifier: email,
            token: hashedToken,
            expires,
          },
        }),
        render(createSSRApp(VerificationCodeEmail, { appName: useRuntimeConfig().public.appName, verificationCode: token })),
      ])

      await ctx.resend.sendEmail({
        from: useRuntimeConfig().resend.fromAddress,
        to: email,
        subject: `${useRuntimeConfig().public.appName} - Login verification code`,
        html,
      })

      return email
    }),

  logout: publicProcedure
    .mutation(async ({ ctx }) => {
      await ctx.session.clear()
    }),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string().length(6),
      }),
    )
    .mutation(async ({ ctx, input: { email, otp } }) => {
      try {
        await verifyToken(ctx.prisma, {
          token: otp,
          email,
        })
      }
      catch (e) {
        if (e instanceof VerificationError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: e.message,
            cause: e,
          })
        }
        throw e
      }

      const data = {
        email,
        name: email.split('@')[0],
        admin: admins.includes(email),
      }

      const user = await ctx.prisma.user.upsert({
        where: { email },
        update: {},
        create: data,
        select: defaultUserSelect,
      })

      await ctx.session.update({
        id: user.id,
      })

      return user
    }),
})
