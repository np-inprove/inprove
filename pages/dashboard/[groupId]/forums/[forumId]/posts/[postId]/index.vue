<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

const route = useRoute()

const { data: post, isLoading: postIsLoading, error: postError } = useForumPost(route.params.forumId as string, route.params.postId as string)
</script>

<template>
  <div w-full flex flex-col>
    <ForumPostHeader
      :group-id="
        route.params.groupId as string
      "
      :forum-id="
        route.params.forumId as string
      "
    />

    <div v-if="postIsLoading" p4 space-y-4>
      <Skeleton height="20px" />
      <Skeleton height="40px" />
      <Skeleton height="100px" />
    </div>

    <LazyErrorCard v-else-if="postError" v-bind="postError" />

    <div v-else-if="post" p4>
      <h2 text-xl font-semibold>
        {{ post.title }}
      </h2>
      <p>
        {{ post.content }}
      </p>

      <div mt4>
        <ForumPostReactionPanel
          :post-id="post.id"
          :forum-id="
            route.params.forumId as string
          "
        />
      </div>
    </div>
  </div>
</template>
