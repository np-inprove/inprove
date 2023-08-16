<script setup lang="ts">
import Button from 'primevue/button'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable from 'primevue/datatable'
import ScrollPanel from 'primevue/scrollpanel'
import { useConfirm } from 'primevue/useconfirm'
import { formatRelative } from 'date-fns'

// TODO yes, proper loading, etc.
const confirm = useConfirm()
const { data: redeemed, isLoading: redeemedIsLoading } = useRedeemedVouchers()
const { mutate: updateMutate, isLoading: isUpdateLoading } = useClaimRedeem()

const relativeRedeemed = computed(() => {
  const now = new Date()
  return redeemed.value?.map(v => ({
    ...v,
    timestamp: formatRelative(v.timestamp, now),
  }))
})

function claimVoucher(redemptionId: any) {
  updateMutate({
    redemptionId,
  })
}

function confirmClaimVoucher(redemptionData: any) {
  confirm.require({
    message: 'You should only redeem this voucher at the voucher redemption location.',
    header: `Are you sure you want to redeem this ${redemptionData.voucher.name} voucher?`,
    icon: 'i-tabler-alert-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      claimVoucher(redemptionData.id)
    },
  })
}
</script>

<template>
  <div w-full flex flex-col>
    <ConfirmDialog />
    <Toast />
    <CommonHeader title="Voucher Redeemed" />

    <div h-full overflow-y-auto>
      <ScrollPanel style="height: 100%">
        <div p4>
          <DataTable :value="relativeRedeemed">
            <Column field="voucher.name" header="Voucher name" />
            <Column field="timestamp" header="Redemption time" />
            <Column field="claimed" header="Claim Status" sortable>
              <template #body="bodySlot">
                <Button
                  v-if="bodySlot.data.claimed === false"
                  v-model="bodySlot.data.claimed"
                  label="Claim Now"
                  severity="danger"
                  @click="confirmClaimVoucher(bodySlot.data)"
                />
                <div v-else>
                  Claimed
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </ScrollPanel>
    </div>
  </div>
</template>
