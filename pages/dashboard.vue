<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

definePageMeta({
  middleware: ['auth'],
})

const { $client } = useNuxtApp()

/**
 * Don't handle any error here since dashboard pages
 * need to check for institution, so let them handle the error.
 */

const { data: me, suspense } = useQuery({
  queryKey: ['me'],
  queryFn: () => $client.me.get.query(),
})

await suspense()
</script>

<template>
  <div class="h-full flex flex-col">
    <DashboardHeader :name="me?.name" :admin="me?.admin" />
    <NuxtPage />
  </div>
</template>
