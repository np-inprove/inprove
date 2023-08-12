<script setup lang="ts">
const Sidebar = defineAsyncComponent(() => import('primevue/sidebar'))

const { data: me, status: meStatus, refetch } = useQuery(queries.me.info)
const { error: groupsError } = useQuery(queries.groups.list)

const { visible } = useSidebar()
</script>

<template>
  <div h-full flex>
    <!-- Sidebar and page -->
    <!-- Let page handle loading skeleton -->
    <!-- TODO should reorganize this: always show sidebar -->

    <Sidebar v-model:visible="visible" class="md:hidden">
      <DashboardSidebar />
    </Sidebar>

    <div class="min-w-[250px] w-[250px] !hidden md:flex!" border-r="1 solid $surface-border">
      <DashboardSidebar />
    </div>

    <div v-if="groupsError" flex flex-1 items-center justify-center>
      <!-- Error -->
      <LazyErrorCard v-bind="groupsError" />
    </div>

    <div v-else-if="meStatus === 'success' && !me?.institution && !me?.admin" flex flex-1 items-center justify-center>
      <!-- No institution -->
      <DashboardNoInstitutionCard @refresh="refetch" />
    </div>

    <div v-else h-full flex flex-1>
      <NuxtPage />
    </div>
  </div>
</template>
