<script setup lang="ts">
// Visible on first load, so no dynamic import
import Button from 'primevue/button'

const Dialog = defineAsyncComponent(() => import('primevue/dialog'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))
const Textarea = defineAsyncComponent(() => import('primevue/textarea'))
const InputNumber = defineAsyncComponent(() => import('primevue/inputnumber'))

const { mutate: createMutate } = useCreateVoucher()

const initFormData = {
  visible: false,
  name: '',
  description: '',
  pointsRequired: 0,
}
const formData = ref({ ...initFormData })

function createVoucher() {
  createMutate(formData.value, {
    onSuccess() {
      formData.value = { ...initFormData }
    },
  })
}
</script>

<template>
  <Button size="small" icon="true" icon-pos="right" label="Create voucher" :pt="{ icon: { class: 'i-tabler-plus' } }" @click="formData.visible = true" />
  <Dialog v-model:visible="formData.visible" modal header="New voucher" class="min-w-sm">
    <form space-y-4 @submit.prevent="createVoucher">
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
        <Button type="submit" size="small" label="Create" />
      </div>
    </form>
  </Dialog>
</template>
