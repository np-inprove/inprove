<script setup lang="ts">
import formatRelative from 'date-fns/formatRelative/index'

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
    <small v-if="props.endDate" class="text-$text-color-secondary">
      {{ formatRelative(props.endDate, new Date()) }}
    </small>
  </div>
</template>
