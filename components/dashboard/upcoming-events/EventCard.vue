<script setup lang="ts">
const props = defineProps<{
  name: string
  deadline: boolean
  startDate?: Date
  endDate: Date
}>()
</script>

<template>
  <div>
    {{ props }}
  </div>
</template>
