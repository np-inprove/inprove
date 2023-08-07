<script setup lang="ts">
import Divider from 'primevue/divider'

const { data: me } = useMe()

const items = computed(() => [
  {
    to: '/dashboard/institution/settings',
    match: ['/dashboard/institution/settings'],
    name: 'Vouchers',
  },
  {
    to: `/dashboard/institution/settings/invites?institutionId=${me?.value?.institution?.id}`,
    match: ['/dashboard/institution/settings/invites'],
    name: 'Invite links',
  },
])
</script>

<template>
  <main w-full flex flex-col p6>
    <h1 text-2xl font-bold tracking-tight>
      Institution dashboard
    </h1>
    <p>Manage settings for {{ me?.institution?.name }}</p>

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
  </main>
</template>
