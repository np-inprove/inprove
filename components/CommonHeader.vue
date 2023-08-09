<script setup lang="ts">
import Button from 'primevue/button'

const props = withDefaults(defineProps<{
  title?: string
}>(),
{
  title: 'Dashboard',
})

const { visible } = useSidebar()
</script>

<template>
  <header class="header flex items-center justify-between border-b-1 border-b-$surface-border border-b-solid px6 py4">
    <div flex items-center space-x-4>
      <div md:hidden>
        <Button text size="small" :pt="{ root: { style: 'padding: 0 !important' } }" @click="visible = !visible">
          <div v-if="visible" class="text-xl" i-tabler-layout-sidebar-left-collapse />
          <div v-else class="text-xl" i-tabler-layout-sidebar-left-expand />
        </Button>
      </div>

      <span font-semibold>{{ props.title }}</span>
    </div>
  </header>
</template>
