<script setup lang="ts">
import Card from 'primevue/card'

const props = defineProps<{
  groupId: string
  forumId: string
  name: string
  description: string
}>()
</script>

<template>
  <NuxtLink prefetch :to="`/dashboard/${props.groupId}/forums/${props.forumId}`">
    <Card :pt="$pt.clickableCard">
      <template #subtitle>
        # {{ props.name }}
      </template>
      <template #content>
        {{ props.description }}
      </template>
    </Card>
  </NuxtLink>
</template>
