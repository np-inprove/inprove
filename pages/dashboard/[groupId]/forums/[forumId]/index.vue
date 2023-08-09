<script setup lang="ts">
import Skeleton from 'primevue/skeleton'

const route = useRoute()

const { data: forum, isLoading: forumIsLoading } = useForum(route.params.forumId as string)
const { data: posts, isLoading: postsIsLoading, error: postsError } = useForumPosts(route.params.forumId as string)
</script>

<template>
  <div p4 space-y-8 md:p8>
    <div flex items-center justify-between>
      <div>
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
          # {{ forum?.name }}
        </h3>
        <p className="text-xl text-muted-foreground">
          {{ forum?.description }}
        </p>
      </div>

      <div>
        <ForumNewPostButton
          :forum-id="
            route.params.forumId as string
          "
        />
      </div>
    </div>

    <div v-if="postsIsLoading" space-y-4>
      <Skeleton v-for="_, idx in Array.from({ length: 10 })" :key="idx" height="100px" />
    </div>

    <LazyErrorCard v-else-if="postsError" v-bind="postsError" />

    <div v-else-if="posts" flex flex-col gap4>
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`${$route.path}/posts/${post.id}`"
        prefetch
      >
        <ForumPostCard
          :forum-id="
            route.params.forumId as string
          "
          :post-id="post.id"
          :title="post.title"
          :content="post.richContent"
          :author-name="post.author?.name ?? ''"
          :timestamp="post.timestamp"
        />
      </NuxtLink>
    </div>
  </div>
</template>
