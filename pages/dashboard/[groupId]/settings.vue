<script setup lang="ts">
import Divider from 'primevue/divider'

const route = useRoute()
const { data: group } = useGroup(route.params.groupId as string)

const items = computed(() => [
  {
    to: `/dashboard/${route.params.groupId}/settings`,
    match: [`/dashboard/${route.params.groupId}/settings`],
    name: 'Invites',
  },
  {
    to: `/dashboard/${route.params.groupId}/settings/advanced`,
    match: [`/dashboard/${route.params.groupId}/settings/advanced`],
    name: 'Advanced',
  },
])
</script>

<template>
  <div p4 md:p8>
    <h1 text-2xl font-bold tracking-tight>
      Group settings
    </h1>
    <p>Manage the {{ group?.name }} group</p>

    <!-- For some reason, the divider does not appear -->
    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <div mt6 flex flex-col pl4 lg:flex-row space-y-8 lg:space-x-12 lg:space-y-0>
      <!-- Styles copied from ui.shadcn.com -->
      <aside class="-ml4">
        <nav flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1>
          <NuxtLink
            v-for="{ to, match, name } in items" :key="to" :to="to"
            :class="{ 'bg-$highlight-bg text-$highlight-text-color hover:no-underline': match.indexOf($route.path) > -1 }"
            class="h-9 inline-flex cursor-pointer items-center justify-start rounded-md px-4 py-2 font-normal transition-colors disabled:pointer-events-none hover:bg-$highlight-bg font-medium! hover:text-$highlight-text-color hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1"
          >
            {{ name }}
          </NuxtLink>
        </nav>
      </aside>

      <div flex-1 lg:max-w-5xl>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
