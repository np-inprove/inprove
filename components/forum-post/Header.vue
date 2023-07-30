<script setup lang="ts">
// TODO this is essentially the same as components/forum/Header.vue, but with broken breadcrumbs that I need to figure out
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

const props = defineProps<{
  groupId: string
  forumId: string
}>()

const route = useRoute()
const { visible } = useSidebar()

const { data: group, isLoading: groupIsLoading } = useGroup(props.groupId)
const { data: forum, isLoading: forumIsLoading } = useForum(props.forumId)
</script>

<template>
  <header class="header flex items-center justify-between border-b-1 border-b-$surface-border border-b-solid px6 py4">
    <Skeleton v-if="groupIsLoading || forumIsLoading" height="20px" width="30%" />

    <Transition v-else-if="group && forum" appear>
      <span flex="~ gap3 items-center">
        <NuxtLink to="../../..">
          {{ group.name }}
        </NuxtLink>
        <span>
          /
        </span>
        <span>
          Forums
        </span>
        <span>
          /
        </span>
        <NuxtLink class="font-semibold" to="..">
          # {{ forum.name }}
        </NuxtLink>
        <small>
          {{ forum.description }}
        </small>
      </span>
    </Transition>

    <div flex items-center gap3>
      <div md:hidden>
        <Button text size="small" :pt="{ root: { style: 'padding: 0 !important' } }" @click="visible = !visible">
          <div v-if="visible" class="text-xl" i-tabler-layout-sidebar-left-collapse />
          <div v-else class="text-xl" i-tabler-layout-sidebar-left-expand />
        </Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
