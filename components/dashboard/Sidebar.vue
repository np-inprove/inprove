<script setup lang="ts">
/**
 * Note to self: don't overthink this, just do data fetching here (:
 * Anyways, this is under components/dashboard, it's fine.
 */

import ScrollPanel from 'primevue/scrollpanel'
import Skeleton from 'primevue/skeleton'
import { InstitutionRole } from '@prisma/client'

const props = withDefaults(defineProps<{
  createGroupAllowedRoles?: InstitutionRole[]
}>(), {
  createGroupAllowedRoles: () => [
    InstitutionRole.Admin,
    InstitutionRole.Educator,
  ],
})

const ContextMenu = defineAsyncComponent(() => import('primevue/contextmenu'))

const menu = ref()
const config = useRuntimeConfig()
const { $client } = useNuxtApp()

const { data: me, isLoading: meIsLoading } = useMe()
const { data: groups, isLoading: groupsIsLoading } = useGroups()

const sidebarItems = computed(() => {
  const base = [
    {
      title: 'Home',
      icon: 'i-tabler-home',
      match: ['/dashboard'],
      to: '/dashboard',
    },
  ]

  if (me?.value?.admin) {
    base.push({
      title: 'Admin',
      icon: 'i-tabler-settings',
      match: ['/dashboard/__admin'],
      to: '/dashboard/__admin',
    })
  }

  return base
})

const groupContextMenu = computed(() => {
  return [
    { label: 'Settings' },
  ]
})

async function logout() {
  // TODO clear query cache
  await $client.auth.email.logout.mutate()
  navigateTo('/login')
}

function openContextMenu(event: any) {
  menu.value.show(event)
}
</script>

<template>
  <nav w-full flex flex-col p4 space-y-4>
    <div flex items-center justify-between>
      <NuxtLink class="font-semibold" to="/dashboard">
        {{ config.public.appName }}
      </NuxtLink>

      <Skeleton v-if="meIsLoading" width="29px" height="29px" shape="circle" />
      <LazyDashboardSidebarUserProfile v-else :name="me?.name" @logout="logout" />
    </div>

    <Skeleton v-if="meIsLoading" height="100px" />
    <div v-else space-y-2>
      <NuxtLink
        v-for="{ title, icon, match, to } in sidebarItems"
        :key="title" :to="to" :class="{ 'bg-$highlight-bg text-$highlight-text-color hover:no-underline': match.includes($route.path) }"
        class="w-full inline-flex cursor-pointer items-center justify-start gap2 rounded-md px-4 py-2 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
      >
        <div :class="icon" />
        {{ title }}
      </NuxtLink>
    </div>

    <div mb4 mt8 flex items-center justify-between>
      <small>Groups</small>

      <LazyDashboardSidebarCreateGroup
        v-if="me?.institutionRole && props.createGroupAllowedRoles.indexOf(me.institutionRole) > -1"
      />
    </div>

    <div class="h-full overflow-y-auto">
      <ContextMenu ref="menu" :model="groupContextMenu" />

      <Skeleton v-if="groupsIsLoading" height="100%" width="100%" />
      <ScrollPanel v-else style="height: 100%; padding-right: 16px;">
        <TransitionGroup appear>
          <NuxtLink
            v-for="group in groups" :key="group.id" :to="`/dashboard/${group.id}`"
            :class="{ 'bg-$highlight-bg text-$highlight-text-color hover:no-underline': $route.params.groupId === group.id }"
            class="mt2 w-full inline-flex cursor-pointer items-center justify-start gap2 rounded-md px-4 py-2 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
            @contextmenu="openContextMenu"
          >
            {{ group.name }}
          </NuxtLink>
        </TransitionGroup>
      </ScrollPanel>
    </div>
  </nav>
</template>

<style scoped>
.v-move,
.v-enter-active,
.v-leave-active {
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.v-leave-active {
  position: absolute;
}
</style>
