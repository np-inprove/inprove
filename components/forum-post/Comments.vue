<script setup lang="ts">
const props = defineProps<{
  forumId: string
  postId: string
}>()

const { data: comments, isLoading: commentsIsLoading, error: commentsError } = useForumPosts(props.forumId, props.postId)
</script>

<template>
  <div space-y-2>
    <div v-for="comment in comments" :key="comment.id" p2 class="rounded-md bg-$surface-c">
      <span font-semibold>
        {{ comment.author?.name }}
      </span>
      {{ comment.content }}
    </div>
  </div>
</template>
