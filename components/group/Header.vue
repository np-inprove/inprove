<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

const props = defineProps<{
  groupId: string
}>()

const Menu = defineAsyncComponent(() => import('primevue/menu'))

const { visible } = useSidebar()

const menu = ref()
const { data: group, isLoading: groupIsLoading } = useGroup(props.groupId)

function openMenu(event: any) {
  menu.value?.toggle(event)
}
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
        <span flex="~ gap3 items-center">
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

    <div space-x-2>
      <NuxtLink
        prefetch :to="`/dashboard/${groupId}`"
        exact-active-class="bg-$highlight-bg text-$highlight-text-color hover:no-underline"
        class="hidden cursor-pointer items-center justify-start rounded-md px-4 py-1 font-normal transition-colors disabled:pointer-events-none md:inline-flex hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
      >
        Home
      </NuxtLink>

      <NuxtLink
        prefetch :to="`/dashboard/${groupId}/quizzes`"
        active-class="bg-$highlight-bg text-$highlight-text-color hover:no-underline"
        class="hidden cursor-pointer items-center justify-start rounded-md px-4 py-1 font-normal transition-colors disabled:pointer-events-none md:inline-flex hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
      >
        Quizzes
      </NuxtLink>

      <Button size="small" type="button" text plain icon="" aria-haspopup="true" aria-controls="overlay_menu" @click="openMenu">
        <div i-tabler-dots text-base />
      </Button>

      <Menu
        id="overlay_menu" ref="menu" :model="[
          {
            label: 'Home',
            to: `/dashboard/${props.groupId}`,
            class: 'md:hidden',
          },
          {
            label: 'Quizzes',
            to: `/dashboard/${props.groupId}/quizzes`,
            class: 'md:hidden',
          },
          {
            label: 'Settings',
            to: `/dashboard/${props.groupId}/settings`,
          },

        ]" :popup="true"
      />
    </div>
  </header>
</template>
