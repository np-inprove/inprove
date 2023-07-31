<script setup lang="ts">
import Card from 'primevue/card'
import formatRelative from 'date-fns/formatRelative/index'

const props = defineProps<{
  title: string
  content: string
  authorName: string
  timestamp: Date
}>()

const emit = defineEmits(['click'])

const relativeTimestamp = computed(() => {
  return formatRelative(props.timestamp, new Date())
})
</script>

<template>
  <Card :pt="$pt.clickableCard" @click="emit('click')">
    <template #title>
      <span flex items-center justify-between>
        <span>
          {{ props.title }}
        </span>
        <span text-sm font-normal opacity-80>
          {{ props.authorName }}
          <br>
          {{ relativeTimestamp }}
        </span>
      </span>
    </template>
    <template #content>
      {{ content }}
    </template>
  </Card>
</template>
