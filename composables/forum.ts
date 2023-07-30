import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { UseQueryOptions } from '@tanstack/vue-query'
import type { CreateForumPostInput, ReactForumPostInput } from '~/shared/forum-post'
import type { DefaultForum, DefaultForumPost, DefaultForumPostReaction, TRPCClientError } from '~/shared/types'

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

  return useQuery(['forums', forumId, 'posts', parentId, 'children'],
    () => $client.forumPost.list.query({ forumId, parentId }),
  )
}

export function useForumPost(forumId: string, postId: string) {
  const { $client } = useNuxtApp()

  return useQuery(['forums', forumId, 'posts', postId], () => $client.forumPost.get.query({ forumId, postId }))
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
      queryClient.setQueryData<DefaultForumPost[]>(['forums', forumId, 'posts', parentId], old => [
        ...old!,
        {
          ...newPost,
          forumId,
          authorId: '',
          timestamp: new Date(),
          id: 'Generating...',
        },
      ])

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

export function useReactForumPostMutation(forumId: string, postId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation<
    DefaultForumPostReaction,
    TRPCClientError,
    Omit<ReactForumPostInput, 'postId' | 'forumId'>
  >({
    mutationFn: reaction => $client.forumPost.react.mutate({
      postId,
      forumId,
      ...reaction,
    }),
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['forums', forumId, 'posts', postId] })
    },
  })
}
