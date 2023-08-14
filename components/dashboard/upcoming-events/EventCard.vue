<script setup lang="ts">
import formatRelative from 'date-fns/formatRelative/index'

const props = defineProps<{
  name: string
  deadline: boolean
  startDate?: Date | null
  endDate?: Date | null
}>()

const iconClass = computed(() => {
  if (props.deadline)
    return 'i-tabler-checklist'

  else
    return 'i-tabler-calendar-event'
})
</script>

<template>
  <button class="w-full flex items-center justify-between rounded-md bg-$surface-card py2 pl3 pr4 hover:bg-$surface-hover">
    <div class="flex items-center">
      <span class="mr-1" :class="iconClass" />
      <span>
        {{ props.name }}
      </span>
    </div>
    <small v-if="props.endDate" class="text-$text-color-secondary">
      {{ props.deadline ? 'Due' : '' }}
      {{ formatRelative(props.endDate, new Date()) }}
    </small>
  </button>
</template>
