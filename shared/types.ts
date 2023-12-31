import type { TRPCClientError as __TRPCClientError } from '@trpc/client'

import type { AppRouter } from '~/server/trpc/modules'

export type { DefaultInstitution } from '~/server/trpc/modules/institution/institution.select'
export type { DefaultInstitutionInvite } from '~/server/trpc/modules/institution/institution-invite.select'
export type { DefaultUser } from '~/server/trpc/modules/user/user.select'
export type { DefaultGroup } from '~/server/trpc/modules/group/group.select'
export type { DefaultGroupUsers, DetailedGroupUsers } from '~/server/trpc/modules/group/group-users.select'
export type { DefaultGroupInvite } from '~/server/trpc/modules/group/group-invite.select'
export type { DefaultEvent } from '~/server/trpc/modules/event/event.select'
export type { DefaultForum } from '~/server/trpc/modules/forum/forum.select'
export type { DefaultForumPost } from '~/server/trpc/modules/forum/forum-post.select'
export type { DefaultForumPostReaction } from '~/server/trpc/modules/forum/forum-post-reaction.select'
export type { DefaultVoucher } from '~/server/trpc/modules/voucher/voucher.select'

export type TRPCClientError = __TRPCClientError<AppRouter>
