<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import Toast from 'primevue/toast'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const { data: redemptions, isLoading: redemptionsIsLoading, error: redemptionsError } = useClaimRedeems()
const { mutate: updateMutate, isLoading: isUpdateLoading } = useAdminClaimRedeem()

function claimVoucher(redemptionId: any, userId: any) {
  updateMutate({
    redemptionId,
    userId,
  },
  {
    onSuccess() {
      toast.add({
        summary: 'Voucher Claimed!',
        severity: 'success',
        life: 3000,
      })
    },
  })
}

function confirmClaimVoucher(redemptionData: any) {
  confirm.require({
    message: 'You should only redeem this voucher at the voucher redemption location.',
    header: `Are you sure you want to redeem this ${redemptionData.voucher.name} voucher?`,
    icon: 'i-tabler-alert-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      claimVoucher(redemptionData.id, redemptionData.user.id)
    },
  })
}
</script>

<template>
  <div>
    <ConfirmDialog />
    <Toast />

    <Skeleton v-if="redemptionsIsLoading" height="300px" />
    <LazyErrorCard v-else-if="redemptionsError" v-bind="redemptionsError" />

    <template v-else>
      <Card v-if="redemptions?.length === 0">
        <template #title>
          No vouchers available to claim. 
        </template>
        <template #subtitle>
          No vouchers are currently unclaimed. Please check back later.
        </template>
      </Card>

      <DataTable v-else :value="redemptions">
        <Column field="voucher.name" header="Voucher Name" sortable />
        <Column field="user.name" header="User Name" sortable />
        <Column field="claimed" header="Unclaimed">
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
    </template>
  </div>
</template>
