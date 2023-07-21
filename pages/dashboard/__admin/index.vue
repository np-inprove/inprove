<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Skeleton from 'primevue/skeleton'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import { useQuery } from '@tanstack/vue-query'

const { $client } = useNuxtApp()

const { data: institutions, isLoading: institutionsIsLoading, error: institutionsError, suspense } = useQuery({
  queryKey: ['institutions'],
  queryFn: () => $client.institution.list.query(),
})

await suspense()
</script>

<template>
  <div>
    <h2 text-lg font-medium>
      Institutions
    </h2>
    <p text-sm opacity-80>
      List of all institutions on iNProve
    </p>

    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <Skeleton v-if="institutionsIsLoading" height="200px" />
    <ErrorCard v-else-if="institutionsError" v-bind="institutionsError" />
    <template v-else-if="institutions">
      <LazyWrapper>
        <Dialog />
      </LazyWrapper>

      <Card v-if="institutions?.length === 0">
        <template #title>
          No institutions available
        </template>
        <template #subtitle>
          No institutions have been created yet, make one now!
        </template>
        <template #content>
          <Button size="small" label="Create institution" />
        </template>
      </Card>

      <DataTable v-else :value="institutions" />
    </template>
  </div>
</template>
