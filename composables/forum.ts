import { useQuery } from '@tanstack/vue-query'
import type { UseQueryOptions } from '@tanstack/vue-query'
import type { DefaultForum, DefaultForumPost } from '~/shared/types'

type UseForumsUseQueryOptions = UseQueryOptions<DefaultForum[], Error>

export function useForums(groupId: string, opts?: Omit<UseForumsUseQueryOptions, 'queryKey' | 'queryFn'>) {
  const { $client } = useNuxtApp()

  return useQuery<DefaultForum[], Error>({
    queryKey: ['groups', groupId, 'forums'],
    queryFn: () => $client.forum.list.query({ groupId }),
    ...opts,
  })
}

export function useForum(forumId: string) {
  const { $client } = useNuxtApp()

  return useQuery<DefaultForum, Error>({
    queryKey: ['forums', forumId],
    queryFn: () => $client.forum.get.query({ forumId }),
  })
}

export function useForumPosts(forumId: string, parentId?: string) {
  const { $client } = useNuxtApp()

  return useQuery<DefaultForumPost[], Error>({
    queryKey: ['forums', forumId, 'posts', parentId],
    queryFn: () => $client.forumPost.list.query({ forumId, parentId }),
  })
}
