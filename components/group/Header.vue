<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

const props = defineProps<{
  groupId: string
}>()

const { visible } = useSidebar()

const { data: group, isLoading: groupIsLoading } = useGroup(props.groupId)
</script>

<template>
  <header class="header flex items-center border-b-1 border-b-$surface-border border-b-solid px6 py4">
    <div md:hidden>
      <Button text size="small" :pt="{ root: { style: 'padding: 0 !important' } }" @click="visible = !visible">
        <div v-if="visible" class="text-xl" i-tabler-layout-sidebar-left-collapse />
        <div v-else class="text-xl" i-tabler-layout-sidebar-left-expand />
      </Button>
    </div>

    <Skeleton v-if="groupIsLoading" height="20px" width="30%" />
    <Transition v-else-if="group" appear>
      <span>
        <strong>
          {{ group.name }}
        </strong>
        {{ " " }}
        <small>
          {{ group.description }}
        </small>
      </span>
    </Transition>
  </header>
</template>
