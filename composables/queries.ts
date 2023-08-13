import { mergeQueryKeys } from '@lukemorales/query-key-factory'

export const queries = mergeQueryKeys(
  meQueries,
  groupQueries,
  groupInviteQueries,
  groupUsersQueries,

  institutionQueries,
  institutionInviteQueries,

  quizzesQueries,
)
