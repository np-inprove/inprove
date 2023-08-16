<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Card from 'primevue/card'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Toast from 'primevue/toast'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import type { DefaultVoucher } from '~/shared/types'

const formData = reactive({
  visible: false,
  id: '',
  name: '',
  description: '',
  pointsRequired: 0,
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const { data: vouchers, isLoading: vouchersIsLoading, error: vouchersError } = useVouchers()
const { mutate: updateMutate } = useUpdateVoucher()
const { mutate: deleteMutate } = useDeleteVoucher()

function onEditVoucher(voucher: DefaultVoucher) {
  formData.id = voucher.id
  formData.name = voucher.name
  formData.description = voucher.description
  formData.pointsRequired = voucher.pointsRequired
  formData.visible = true
}

function updateVoucher() {
  updateMutate({
    id: formData.id,
    name: formData.name,
    description: formData.description,
    pointsRequired: formData.pointsRequired,
  },
  {
    onSuccess() {
      toast.add({
        summary: 'Voucher updated!',
        severity: 'success',
        life: 3000,
      })
      formData.visible = false
    },
  })
}

function deleteVoucher(voucherId: string) {
  deleteMutate({
    voucherId,
  },
  {
    onSuccess() {
      toast.add({
        summary: 'Voucher deleted!',
        severity: 'success',
        life: 3000,
      })
    },
  })
}

function confirmDeleteVoucher(VoucherData: any) {
  confirm.require ({
    message: `Are you sure you want to delete this ${VoucherData.name} voucher?`,
    header: 'Delete Voucher Confirmation',
    icon: 'i-tabler-alert-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteVoucher(VoucherData.id)
    },
  })
}
</script>

<template>
  <div>
    <ConfirmDialog />
    <Toast />

    <Dialog v-model:visible="formData.visible" modal header="Edit voucher" class="min-w-sm">
      <form space-y-4 @submit.prevent="updateVoucher">
        <div class="flex flex-col gap-2">
          <label for="name">Name</label>
          <InputText
            id="name" v-model="formData.name" autofocus :required="true" placeholder="Food Club $5"
            aria-describedby="name-help"
          />
          <small id="name-help" class="sr-only">Enter the name of the voucher</small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="points">Points required</label>
          <InputNumber
            id="points" v-model="formData.pointsRequired" :required="true" placeholder="5000"
            aria-describedby="points-help"
          />
          <small id="points-help" class="sr-only">Enter the points required to redeem the voucher</small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="description">Description</label>
          <Textarea
            id="description" v-model="formData.description" placeholder="Use this $5 voucher to buy anything (chicken rice) at Food Club!"
            aria-describedby="description-help"
          />
          <small id="description-help" class="sr-only">Enter the description of the voucher</small>
        </div>

        <div mt6>
          <Button type="submit" size="small" label="Update" />
        </div>
      </form>
    </Dialog>

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
        <Column field="name" header="Name" sortable />
        <Column field="description" header="Description" style="width: 50%" />
        <Column field="pointsRequired" header="Points" sortable style="width: 20%" />
        <Column header="Actions">
          <template #body="slotProps">
            <div>
              <Button size="small" text label="Edit" @click="onEditVoucher(slotProps.data)" />
              <Button size="small" text severity="danger" label="Delete" @click="confirmDeleteVoucher(slotProps.data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </div>
</template>
