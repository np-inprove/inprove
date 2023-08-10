<script setup lang="ts">
import ScrollPanel from 'primevue/scrollpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { formatRelative } from 'date-fns'

const { data: redeemed, isLoading: redeemedIsLoading } = useRedeemedVouchers()

const relativeRedeemed = computed(() => {
  const now = new Date()
  return redeemed.value?.map(v => ({
    ...v,
    timestamp: formatRelative(v.timestamp, now),
  }))
})
</script>

<template>
  <div w-full flex flex-col>
    <CommonHeader title="User settings" />

    <div h-full overflow-y-auto>
      <ScrollPanel style="height: 100%">
        <div p4>
          <DataTable :value="relativeRedeemed">
            <Column field="voucher.name" header="Voucher name" />
            <Column field="timestamp" header="Redemption time" />
          </DataTable>
        </div>
      </ScrollPanel>
    </div>
  </div>
</template>
