<script setup lang="ts">
/**
 * Note to self: don't overthink this, just do data fetching here (:
 * Anyways, this is under components/dashboard, it's fine.
 */

import ScrollPanel from 'primevue/scrollpanel'
import Skeleton from 'primevue/skeleton'
import { InstitutionRole } from '~/shared/enums'

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

const { data: me, isLoading: meIsLoading } = useQuery(queries.me.info)
const { data: groups, isLoading: groupsIsLoading } = useQuery(queries.groups.list)

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

  if (me?.value?.institutionRole === InstitutionRole.Admin) {
    base.push({
      title: 'Institution settings',
      icon: 'i-tabler-building',
      match: ['/dashboard/institution/settings'],
      to: '/dashboard/institution/settings',
    })
  }

  return base
})

const selectedGroupId = ref<string>('')

const groupContextMenu = computed(() => {
  return [
    {
      label: 'Quizzes',
      icon: 'i-tabler-bulb-filled',
      to: `/dashboard/${selectedGroupId.value}/quizzes`,
    },
    {
      label: 'Settings',
      icon: 'i-tabler-settings',
      to: `/dashboard/${selectedGroupId.value}/settings`,
    },
  ]
})

async function logout() {
  // TODO clear query cache
  await $client.auth.email.logout.mutate()
  await navigateTo('/login')
}

async function settings() {
  await navigateTo('/dashboard/settings')
}

function openContextMenu(groupId: string, event: any) {
  selectedGroupId.value = groupId
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
      <LazyDashboardSidebarUserProfile v-else :name="me?.name" @logout="logout" @settings="settings" />
    </div>

    <Skeleton v-if="meIsLoading" height="100px" />
    <div v-else space-y-2>
      <NuxtLink
        v-for="{ title, icon, match, to } in sidebarItems"
        :key="title"
        prefetch :to="to" :class="{ 'bg-$highlight-bg text-$highlight-text-color hover:no-underline': match.includes($route.path) }"
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
      <ScrollPanel v-else style="height: 100%;">
        <TransitionGroup appear>
          <NuxtLink
            v-for="group in groups"
            :key="group.id" prefetch :to="`/dashboard/${group.id}`"
            :class="{ 'bg-$highlight-bg text-$highlight-text-color hover:no-underline': $route.params.groupId === group.id }"
            class="mt2 w-full inline-flex cursor-pointer items-center justify-start gap2 rounded-md px-4 py-2 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
            @contextmenu="(event) => openContextMenu(group.id, event)"
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
