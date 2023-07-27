<script setup lang="ts">
const route = useRoute()
const { data: forum, isLoading: forumIsLoading, error: forumError } = useForum(route.params.forumId as string)
</script>

<template>
  <div>
    {{ forum }}
  </div>
</template>
