import type { InstitutionRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import type { DefaultUser } from './user/user.select'

export function assertInstitutionRole(user: DefaultUser, roles: InstitutionRole[]) {
  if (!user.institutionRole) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User does not have sufficient permissions.',
    })
  }

  if (!roles.includes(user.institutionRole)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User does not have sufficient permissions.',
    })
  }
}
