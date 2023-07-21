<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { $client } = useNuxtApp()
const { data } = await $client.me.get.useQuery(undefined, { lazy: true })
</script>

<template>
  <div class="h-full flex flex-col bg-$surface-ground">
    <DashboardTheHeader :name="data?.name ?? 'W'" />

    <NuxtPage />
  </div>
</template>
