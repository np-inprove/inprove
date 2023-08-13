<script setup lang="ts">
import Button from 'primevue/button'

const Dialog = defineAsyncComponent(() => import('primevue/dialog'))
const Textarea = defineAsyncComponent(() => import('primevue/textarea'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))

const { mutate, isLoading } = useCreateGroupMutation()
const { data: me } = useQuery(queries.me.info)

const formData = reactive({
  visible: false,
  name: '',
  description: '',
})

function create() {
  if (!me.value?.institution?.id)
    throw new Error('[components/dashboard/SidebarCreateGroup.vue] User is not in any institution')

  mutate({
    institutionId: me.value.institution.id,
    name: formData.name,
    description: formData.description,
  }, {
    onSettled(data) {
      navigateTo(`/dashboard/${data?.id}`)

      // Reset form data
      formData.name = ''
      formData.description = ''
      formData.visible = false
    },
  })
}
</script>

<template>
  <Button
    size="small"
    :pt="{ root: { style: 'padding: 0 !important' } }" text
    @click="formData.visible = true"
  >
    <div i-tabler-plus />
  </Button>

  <Dialog
    v-model:visible="formData.visible" modal header="New group" style="min-width: 300px;"
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
