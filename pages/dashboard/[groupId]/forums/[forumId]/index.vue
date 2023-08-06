<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import ScrollPanel from 'primevue/scrollpanel'

const route = useRoute()

const { data: forum, isLoading: forumIsLoading } = useForum(route.params.forumId as string)
const { data: posts, isLoading: postsIsLoading, error: postsError } = useForumPosts(route.params.forumId as string)
</script>

<template>
  <div w-full flex flex-col>
    <div flex justify-between p4>
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

    <div v-if="postsIsLoading" p4 space-y-4>
      <Skeleton v-for="_, idx in Array.from({ length: 10 })" :key="idx" height="100px" />
    </div>

    <LazyErrorCard v-else-if="postsError" v-bind="postsError" />

    <template v-else-if="posts">
      <div style="height: 100%; overflow-y: auto">
        <ScrollPanel style="height: 100%">
          <div p4 space-y-4>
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
                :content="post.content"
                :author-name="post.author?.name ?? ''"
                :timestamp="post.timestamp"
              />
            </NuxtLink>
          </div>
        </ScrollPanel>
      </div>
    </template>
  </div>
</template>
