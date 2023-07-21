<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useQuery } from '@tanstack/vue-query'

const { $client } = useNuxtApp()

const { data: me, error: meError, isLoading: meIsLoading, refetch, suspense } = useQuery({
  queryKey: ['me'],
  queryFn: () => $client.me.get.query(),
})

await suspense()
</script>

<template>
  <main h-full flex items-center justify-center px6>
    <div v-if="meIsLoading" mb15 w-full>
      <Skeleton v-if="meIsLoading" class="w-full md:max-w-lg" height="200px" />
    </div>
    <ErrorCard v-else-if="meError" v-bind="meError" />
    <template v-else>
      <!-- Not a part of any institution -->
      <Card v-if="!me?.institutionRole" class="mb15 max-w-md text-center">
        <template #title>
          You are not in any institution.
        </template>
        <template #subtitle>
          Please check you've used the correct email, or contact your institution administrator for help.
        </template>
        <template #content>
          <div flex justify-center gap3>
            <Button outlined size="small" label="Read our FAQs" />
            <Button size="small" label="Reload" @click="refetch()" />
          </div>
        </template>
      </Card>

      <div v-else>
        {{ me.institutionRole }}
      </div>
    </template>
  </main>
</template>
