<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import { useQuery } from '@tanstack/vue-query'

const { $client } = useNuxtApp()

const { data: me, error: meError, isLoading: meIsLoading, refetch } = useQuery({
  queryKey: ['me'],
  queryFn: () => $client.me.get.query(),
})

const { data: groups, error: groupsError, isLoading: groupsIsLoading } = useGroups()
</script>

<template>
  <main flex flex-1>
    <div mb4 flex-1 border rounded-2xl border-solid p8 class="border-$surface-border">
      <Skeleton v-if="groupsIsLoading" height="50px" width="100%" />
      <template v-else-if="me?.institution">
        <h2 text-2xl font-semibold>
          Hello, {{ me.name }}
        </h2>
      </template>
    </div>
  </main>
</template>
