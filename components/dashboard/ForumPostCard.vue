<script setup lang="ts">
import Card from 'primevue/card'
import formatRelative from 'date-fns/formatRelative'

const props = defineProps<{
  title: string
  content: string
  authorName: string
  timestamp: Date
}>()

const relativeTimestamp = computed(() => {
  return formatRelative(props.timestamp, new Date())
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
    </template>
  </Card>
</template>
