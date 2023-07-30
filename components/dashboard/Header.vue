<script setup lang="ts">
import Button from 'primevue/button'

const { visible } = useSidebar()
</script>

<template>
  <header class="header flex items-center justify-between px6 py4">
    <div flex items-center gap-6>
      <div md:hidden>
        <Button text size="small" :pt="{ root: { style: 'padding: 0 !important' } }" @click="visible = !visible">
          <div v-if="visible" class="text-xl" i-tabler-layout-sidebar-left-collapse />
          <div v-else class="text-xl" i-tabler-layout-sidebar-left-expand />
        </Button>
      </div>
    </div>
  </header>
</template>
