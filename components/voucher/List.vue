<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Skeleton from 'primevue/skeleton'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const toast = useToast()

const { data: vouchers, isLoading: vouchersIsLoading, error: vouchersError } = useVouchers()
</script>

<template>
  <div>
    <Toast />
    <Skeleton v-if="vouchersIsLoading" height="300px" />
    <LazyErrorCard v-else-if="vouchersError" v-bind="vouchersError" />

    <template v-else>
      <Card v-if="vouchers?.length === 0">
        <template #title>
          No vouchers available
        </template>
        <template #subtitle>
          No vouchers have been created yet, make one now!
        </template>
      </Card>

      <DataTable v-else :value="vouchers">
        <Column field="id" header="ID" />
        <Column field="name" header="Name" sortable style="width: 50%" />
        <Column field="description" header="Description" />
        <Column field="pointsRequired" header="Points" sortable style="20%" />
      </DataTable>
    </template>
  </div>
</template>
