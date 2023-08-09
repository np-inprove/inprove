<script setup lang="ts">
const props = defineProps<{
  forumId: string
  postId: string
}>()

const { data: comments, isLoading: commentsIsLoading, error: commentsError } = useForumPosts(props.forumId, props.postId)
</script>

<template>
  <div space-y-2>
    <div v-for="comment in comments" :key="comment.id" p2 class="rounded-md">
      <span font-semibold>
        {{ comment.author?.name }}
      </span>
      <ForumTiptapEditor v-model="comment.richContent" :editable="false" class="w-full rounded-md bg-$surface-card p2" />
    </div>
  </div>
</template>
