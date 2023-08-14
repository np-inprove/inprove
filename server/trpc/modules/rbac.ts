import { TRPCError } from '@trpc/server'
import type { DefaultUser } from './user/user.select'
import type { DefaultGroupUsers } from './group/group-users.select'
import type { GroupRole, InstitutionRole } from '~/shared/enums'

/**
 * Helper to check institution roles and then throw TRPC errors
 *
 *
 * @param user user object
 * @param roles allowed roles
 */
export function assertInstitutionRole(user: DefaultUser, ...roles: InstitutionRole[]): void {
  if (!user.institution?.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User does not have sufficient permissions.',
    })
  }

  if (!user.institutionRole) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User does not have sufficient permissions.',
    })
  }

  if (!roles.includes(user.institutionRole)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User does not have sufficient permissions.',
    })
  }
}

export function assertGroupRole(groupUser: DefaultGroupUsers, ...roles: GroupRole[]) {
  if (!roles.includes(groupUser.role)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'User does not have sufficient permissions.',
    })
  }
}
