<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import { useQuery } from '@tanstack/vue-query'

const { $client } = useNuxtApp()

const { data: me, error: meError, isLoading: meIsLoading, refetch } = useQuery({
  queryKey: ['me'],
  queryFn: () => $client.me.get.query(),
})
</script>

<template>
  <VeryRoundCard mb4>
    <Skeleton v-if="meIsLoading" height="35px" />
    <div v-else-if="meError" flex flex-1 items-center justify-center>
      <LazyErrorCard v-bind="meError" />
    </div>
    <Transition v-else-if="me" appear>
      <h2 text-2xl font-semibold>
        Hello, {{ me.name }}
      </h2>
    </Transition>
  </VeryRoundCard>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
