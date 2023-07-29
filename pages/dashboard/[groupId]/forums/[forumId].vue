<script setup lang="ts">
/**
 * TODO Loading and error handling states, maybe a better layout
 */

import Divider from 'primevue/divider'
import Skeleton from 'primevue/skeleton'

const route = useRoute()

const { data: forum, isLoading: forumIsLoading, error: forumError } = useForum(route.params.forumId as string)
const { data: posts, isLoading: postsIsLoading, error: postsError } = useForumPosts(route.params.forumId as string)
</script>

<template>
  <VeryRoundCard>
    <Skeleton v-if="forumIsLoading" />
    <LazyErrorCard v-else-if="forumError" v-bind="forumError" />
    <template v-else-if="forum">
      <h2 text-lg font-semibold>
        # {{ forum?.name }}
      </h2>
      <small>{{ forum.description }}</small>

      <!-- For some reason, the divider does not appear -->
      <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

      <DashboardForumPostCard
        v-for="post in posts" :key="post.id" :title="post.title" :content="post.content"
        :author-name="post.author?.name ?? ''" :timestamp="post.timestamp"
      />
    </template>
  </VeryRoundCard>
</template>
