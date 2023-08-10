import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { CreateAttachmentPresignedUrl, CreateForumPostInput, ReactForumPostInput } from '~/shared/forum-post'

export function useForums(groupId: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['forum', 'list', groupId],
    queryFn: () => $client.forum.list.query({ groupId }),
  })
}

export function useForum(forumId?: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['forum', 'get', forumId],
    queryFn: () => $client.forum.get.query({ forumId: forumId! }),
    enabled: !!forumId,
  })
}

export function useForumPosts(forumId: string, parentId?: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['forumPost', 'list', forumId, parentId],
    queryFn: () => $client.forumPost.list.query({ forumId, parentId }),
  })
}

export function useForumPost(forumId: string, postId: string) {
  const { $client } = useNuxtApp()

  return useQuery({
    queryKey: ['forumPost', 'get', forumId, postId],
    queryFn: () => $client.forumPost.get.query({ forumId, postId }),
  })
}

export function useCreateForumPostMutation(forumId: string, parentId?: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: Omit<CreateForumPostInput, 'forumId'>) => $client.forumPost.create.mutate({
      ...post,
      forumId,
      parentId,
    }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['forumPost', 'list', forumId, parentId] })
    },
  })
}

export function useReactForumPostMutation(forumId: string, postId: string) {
  const { $client } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reaction: Omit<ReactForumPostInput, 'postId' | 'forumId'>) => $client.forumPost.react.mutate({
      postId,
      forumId,
      ...reaction,
    }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['forumPost', 'get', forumId, postId] })
    },
  })
}

// TODO really need to clean up this function.
export function useUploadAttachment(forumId: string) {
  const { $client } = useNuxtApp()

  const presignMutate = useMutation({
    mutationFn: (input: Omit<CreateAttachmentPresignedUrl, 'forumId'>) => $client.forumPost.createAttachmentPresignedUrl.mutate({
      forumId,
      ...input,
    }),
  })

  return useMutation({
    mutationFn: async (input: File[]) => {
      const urls = await presignMutate.mutateAsync({
        files: input.map(f => ({ name: f.name, contentType: f.type })),
      })

      await Promise.all(urls.map(async ({ presignedUrl }, idx) => {
        return await fetch(presignedUrl, {
          method: 'PUT',
          body: input[idx],
          headers: {
            'Content-Type': input[idx].type,
          },
        })
      }))

      return urls
    },
  })
}
