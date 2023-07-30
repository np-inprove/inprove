<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import formatRelative from 'date-fns/formatRelative'

const props = defineProps<{
  forumId: string
  postId: string
  title: string
  content: string
  authorName: string
  timestamp: Date
}>()

const showChildrenPosts = ref(false)

const relativeTimestamp = computed(() => {
  return formatRelative(props.timestamp, new Date())
})

const { data: childrenPosts, isLoading: childrenPostsIsLoading, error: childrenPostsError } = useForumPosts(props.forumId, props.postId, {
  enabled: showChildrenPosts,
})
</script>

<template>
  <Card :pt="$pt.clickableCard">
    <template #title>
      {{ props.title }}
    </template>
    <template #subtitle>
      {{ props.authorName }} - {{ relativeTimestamp }}
    </template>
    <template #content>
      {{ content }}
      <Button @click="showChildrenPosts = true">
        Show more
      </Button>
      {{ showChildrenPosts }}
      {{ childrenPosts }}
      har
      {{ childrenPostsIsLoading }}
      har
      {{ childrenPostsError }}
    </template>
  </Card>
</template>
