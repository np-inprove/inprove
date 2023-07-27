<script setup lang="ts">
import Sidebar from 'primevue/sidebar'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import { useQuery } from '@tanstack/vue-query'

definePageMeta({
  middleware: ['auth'],
})

const { $client } = useNuxtApp()

const { data: me, status: meStatus, isLoading: meIsLoading, refetch } = useQuery({
  queryKey: ['me'],
  queryFn: () => $client.me.get.query(),
})

const { data: groups, error: groupsError, isLoading: groupsIsLoading } = useGroups()

const { visible } = useSidebar()
const [SidebarTemplate, ReuseSidebar] = createReusableTemplate()

const dialogs = reactive({
  createGroup: false,
})

const sidebarItems = [
  {
    title: 'Home',
    icon: 'i-tabler-home',
    match: '/dashboard',
  },
]

const createGroupAllowedRoles = ['Admin', 'Educator']
</script>

<template>
  <SidebarTemplate>
    <nav mt8 w-full>
      <NuxtLink
        v-for="{ title, icon, match } in sidebarItems" :key="title" to="/dashboard"
        :class="{ 'bg-$highlight-bg text-$highlight-text-color hover:no-underline': match.indexOf($route.path) > -1 }"
        class="w-full inline-flex cursor-pointer items-center justify-start gap2 rounded-md px-4 py-2 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
      >
        <div :class="icon" />
        {{ title }}
      </NuxtLink>

      <div mb4 mt8 flex items-center justify-between>
        <small>Groups</small>
        <Button
          v-if="me?.institutionRole && createGroupAllowedRoles.indexOf(me?.institutionRole) > -1" size="small"
          :pt="{ root: { style: 'padding: 0 !important' } }" text @click="dialogs.createGroup = true"
        >
          <div i-tabler-plus />
        </Button>
      </div>

      <Skeleton v-if="groupsIsLoading" height="300px" />
      <TransitionGroup v-else appear>
        <NuxtLink
          v-for="group in groups"
          :key="group.id" :to="`/dashboard/${group.id}`"
          exact-active-class="bg-$highlight-bg text-$highlight-text-color hover:no-underline"
          class="w-full inline-flex cursor-pointer items-center justify-start gap2 rounded-md px-4 py-2 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
        >
          {{ group.name }}
        </NuxtLink>
      </TransitionGroup>
    </nav>
  </SidebarTemplate>

  <div class="h-full flex flex-col">
    <DashboardHeader :name="me?.name" :admin="me?.admin" />

    <div v-if="groupsError" flex flex-1 items-center justify-center>
      <!-- Error -->
      <ErrorCard v-bind="groupsError" />
    </div>

    <div v-else-if="meStatus === 'success' && !me?.institution" flex flex-1 items-center justify-center>
      <!-- No institution -->
      <DashboardNoInstitutionCard @refresh="refetch" />
    </div>

    <div v-else flex flex-1 px6>
      <!-- Sidebar and page -->
      <!-- Let page handle loading skeleton -->

      <LazyDashboardCreateGroupDialog v-if="me?.institution?.id" v-model:visible="dialogs.createGroup" :institution-id="me.institution.id" />

      <Sidebar v-model:visible="visible" class="md:hidden">
        <ReuseSidebar />
      </Sidebar>

      <div class="min-w-[200px] w-[200px]" mr4 hidden md:flex md:flex-col>
        <ReuseSidebar />
      </div>

      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
.v-move, /* apply transition to moving elements */
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
