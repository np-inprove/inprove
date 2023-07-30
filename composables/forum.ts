import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { UseQueryOptions } from '@tanstack/vue-query'
import type { CreateForumPostInput } from 'shared/forum-post'
import type { DefaultForum, DefaultForumPost, TRPCClientError } from '~/shared/types'

type UseForumsUseQueryOptions = UseQueryOptions<DefaultForum[], Error>
type UseForumPostsUseQueryOptions = UseQueryOptions<DefaultForumPost[], Error>

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

export function useForumPosts(forumId: string, parentId?: string, opts?: Omit<UseForumPostsUseQueryOptions, 'queryKey' | 'queryFn'>) {
  const { $client } = useNuxtApp()

  return useQuery<DefaultForumPost[], Error>({
    queryKey: ['forums', forumId, 'posts', parentId],
    queryFn: () => $client.forumPost.list.query({ forumId, parentId }),
    ...opts,
  })
}

export function useCreateForumPostMutation(forumId: string, parentId?: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultForumPost,
    TRPCClientError,
    Omit<CreateForumPostInput, 'forumId'>,
    { previousPosts?: DefaultForumPost[] }
  >({
    mutationFn: post => $client.forumPost.create.mutate({
      ...post,
      forumId,
    }),
    async onMutate(newPost) {
      await queryClient.cancelQueries({ queryKey: ['forums', forumId, 'posts', parentId] })
      const previousPosts = queryClient.getQueryData<DefaultForumPost[]>(['forums', forumId, 'posts', parentId])
      queryClient.setQueryData<DefaultForumPost[]>(['forums', forumId, 'posts', parentId], old => [...old!, {
        ...newPost,
        forumId,
        authorId: '',
        timestamp: new Date(),
        id: 'Generating...',
      }])

      return { previousPosts }
    },
    onError(_, __, context) {
      queryClient.setQueryData<DefaultForumPost[]>(['forums', forumId, 'posts', parentId], context?.previousPosts)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['forums', forumId, 'posts', parentId] })
    },
  })
}
