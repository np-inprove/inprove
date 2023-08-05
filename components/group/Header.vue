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
  <header class="header flex items-center justify-between border-b-1 border-b-$surface-border border-b-solid px6 py4">
    <div flex items-center space-x-4>
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
    </div>

    <!-- TODO there's a weird bug in header height when jumping between the pages which overflow -->
    <div space-x-2>
      <NuxtLink
        prefetch :to="`/dashboard/${groupId}`"
        exact-active-class="bg-$highlight-bg text-$highlight-text-color hover:no-underline"
        class="inline-flex cursor-pointer items-center justify-start rounded-md px-4 py-1 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
      >
        Home
      </NuxtLink>

      <NuxtLink
        prefetch :to="`/dashboard/${groupId}/quizzes`"
        active-class="bg-$highlight-bg text-$highlight-text-color hover:no-underline"
        class="inline-flex cursor-pointer items-center justify-start rounded-md px-4 py-1 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
      >
        Quizzes
      </NuxtLink>
    </div>
  </header>
</template>
