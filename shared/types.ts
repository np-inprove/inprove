import type { TRPCClientError as __TRPCClientError } from '@trpc/client'

import type { AppRouter } from '~/server/trpc/modules'

export type { DefaultInstitution } from '~/server/trpc/modules/institution/institution.select'
export type { DefaultInstitutionInvite } from '~/server/trpc/modules/institution/institution-invite.select'

export type TRPCClientError = __TRPCClientError<AppRouter>
