<script setup lang="ts">
const { iconClass, label } = defineProps<{
  iconClass: string
  label: string
}>()
</script>

<template>
  <div class="w-full flex items-center justify-between rounded-md bg-$surface-card px4 py3">
    <div flex items-center text-lg>
      <span class="mr-4" :class="iconClass" />
      <slot>
        {{ label }}
      </slot>
    </div>
  </div>
</template>
