<script setup lang="ts">
import formatRelative from 'date-fns/formatRelative/index'

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
  <Card>
    <CardHeader class="grid grid-cols-[1fr_175px] items-start gap-4 space-y-0">
      <div className="space-y-1">
        <CardTitle>
          {{ props.title }}
        </CardTitle>
        <CardDescription>
          <ForumTiptapEditor disable-prose :model-value="props.content" :editable="false" />
        </CardDescription>
      </div>
      <div className="flex items-center space-x-1 rounded-md">
        <span text-sm font-normal opacity-80>
          {{ props.authorName }}
          <br>
          {{ relativeTimestamp }}
        </span>
      </div>
    </CardHeader>
  </Card>
</template>
