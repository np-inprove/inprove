<script setup lang="ts">
const Sidebar = defineAsyncComponent(() => import('primevue/sidebar'))

definePageMeta({
  middleware: ['auth'],
})

const { data: me, status: meStatus, refetch } = useMe()
const { error: groupsError } = useGroups()

const { visible } = useSidebar()
</script>

<template>
  <div h-full flex>
    <div v-if="groupsError" flex flex-1 items-center justify-center>
      <!-- Error -->
      <LazyErrorCard v-bind="groupsError" />
    </div>

    <div v-else-if="meStatus === 'success' && !me?.institution" flex flex-1 items-center justify-center>
      <!-- No institution -->
      <DashboardNoInstitutionCard @refresh="refetch" />
    </div>

    <div v-else h-full flex flex-1>
      <!-- Sidebar and page -->
      <!-- Let page handle loading skeleton -->

      <Sidebar v-model:visible="visible" class="md:hidden">
        <DashboardSidebar />
      </Sidebar>

      <div class="min-w-[250px] w-[250px]" hidden md:flex>
        <DashboardSidebar />
      </div>

      <NuxtPage />
    </div>
  </div>
</template>
