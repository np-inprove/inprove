<script setup lang="ts">
const props = defineProps<{
  name: string
  deadline: boolean
  startDate?: Date | null
  endDate?: Date | null
}>()
</script>

<template>
  <div class="flex items-center justify-between rounded-md bg-$surface-card px4 py2">
    <span>
      {{ props.name }}
    </span>
    <small class="text-$text-color-secondary">
      {{ props.deadline ? 'Deadline' : 'Event' }}
    </small>
  </div>
</template>
