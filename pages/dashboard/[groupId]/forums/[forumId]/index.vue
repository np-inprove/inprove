<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import ScrollPanel from 'primevue/scrollpanel'

const route = useRoute()

const { data: posts, isLoading: postsIsLoading, error: postsError } = useForumPosts(route.params.forumId as string)
</script>

<template>
  <div w-full flex flex-col>
    <ForumHeader
      :group-id="
        route.params.groupId as string
      "
      :forum-id="
        route.params.forumId as string
      "
    />

    <div v-if="postsIsLoading" p4 space-y-4>
      <Skeleton v-for="_, idx in Array.from({ length: 10 })" :key="idx" height="100px" />
    </div>

    <LazyErrorCard v-else-if="postsError" v-bind="postsError" />

    <template v-else-if="posts">
      <div style="height: 100%; overflow-y: auto">
        <ScrollPanel style="height: 100%">
          <div p4 space-y-4>
            <ForumPostCard
              v-for="post in posts"
              :key="post.id"
              :forum-id="
                route.params.forumId as string
              "
              :post-id="post.id"
              :title="post.title"
              :content="post.content"
              :author-name="post.author?.name ?? ''"
              :timestamp="post.timestamp"
              @click="$router.push(`${$route.path}/posts/${post.id}`)"
            />
          </div>
        </ScrollPanel>
      </div>
    </template>
  </div>
</template>
