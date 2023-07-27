<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  institutionId: string
  visible: boolean
}>()
const emit = defineEmits(['update:visible'])
const { mutate, isLoading } = useCreateGroupMutation()

const formData = reactive({
  name: '',
  description: '',
})

function create() {
  mutate({
    institutionId: props.institutionId,
    name: formData.name,
    description: formData.description,
  }, {
    onSettled(data) {
      navigateTo(`/dashboard/${data?.id}`)
      emit('update:visible', false)
    },
  })
}
</script>

<template>
  <Dialog
    :visible="props.visible" modal header="New group" style="min-width: 300px;"
    @update:visible="emit('update:visible', $event)"
  >
    <form flex flex-col space-y-6 @submit.prevent="create">
      <div class="flex flex-col gap-2">
        <label for="name">Group name</label>
        <InputText id="name" v-model="formData.name" autofocus required />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description">Group description</label>
        <Textarea id="description" v-model="formData.description" />
      </div>

      <Button :loading="isLoading" type="submit" label="Create" />
    </form>
  </Dialog>
</template>
