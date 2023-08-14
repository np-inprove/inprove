<script setup lang="ts">
const { iconClass, label } = withDefaults(
  defineProps<{
    iconClass: string
    label?: string | null
  }>(), {
    label: '-',
  })
</script>

<template>
  <div class="w-full flex items-center justify-between rounded-md bg-$surface-card px4 py3">
    <div flex items-center text-lg>
      <span class="mr-4" :class="iconClass" />
      {{ label }}
    </div>
  </div>
</template>
