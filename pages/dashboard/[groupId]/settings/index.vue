<script setup lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Card from 'primevue/card'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

const { data: group, isLoading: isGroupLoading } = useQuery(queries.groups.details(route.params.groupId as string))
const { mutate: updateMutate, isLoading: isUpdateLoading } = useUpdateGroupMutation(route.params.groupId as string)
const { mutate: deleteMutate, isLoading: isDeleteLoading } = useDeleteGroupMutation(route.params.groupId as string)

const formData = reactive({
  name: group.value?.name ?? '',
  description: group.value?.description ?? '',
})

watch(
  () => isGroupLoading.value,
  (isGroupLoading) => {
    if (!isGroupLoading) {
      formData.name = group.value?.name ?? ''
      formData.description = group.value?.description ?? ''
    }
    else {
      formData.name = ''
      formData.description = ''
    }
  },
)

function updateGroup() {
  updateMutate({
    name: formData.name,
    description: formData.description,
  },
  {
    onSuccess() {
      router.replace(`/dashboard/${route.params.groupId}/settings`)
      toast.add({
        summary: 'Group details updated!',
        severity: 'success',
        life: 3000,
      })
    },
  })
}

function confirmDeleteGroup() {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Delete Confirmation',
    icon: 'i-tabler-alert-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteGroup()
    },
  })
}

function deleteGroup() {
  deleteMutate(undefined, {
    onSuccess() {
      router.replace('/dashboard')
    },
  })
}
</script>

<template>
  <div>
    <ConfirmDialog />
    <Toast />

    <div flex justify-between>
      <div>
        <h2 text-lg font-medium>
          General
        </h2>
        <p text-sm opacity-80>
          Configure various group properties
        </p>
      </div>
    </div>

    <!-- For some reason, the divider does not appear -->
    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <form flex flex-col space-y-6 @submit.prevent="updateGroup">
      <div class="flex flex-col gap-2">
        <label for="name">Group name</label>
        <InputText id="name" v-model="formData.name" :disabled="isGroupLoading" autofocus required />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description">Group description</label>
        <Textarea id="description" v-model="formData.description" :disabled="isGroupLoading" />
      </div>

      <div>
        <Button :disabled="isGroupLoading" :loading="isUpdateLoading" type="submit" label="Update" />
      </div>
    </form>

    <!-- For some reason, the divider does not appear -->
    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <div class="mt-5">
      <h2 mb-3 text-lg font-medium>
        Danger Zone
      </h2>
      <div>
        <Card px-3>
          <template #content>
            <div class="flex justify-between">
              <div>
                <h3 class="text-lg font-medium">
                  Delete group
                </h3>
                <p class="text-md opacity-80">
                  Deleting a group is irreversible. All data associated with the group will be deleted.
                </p>
              </div>
              <div class="flex items-center">
                <Button severity="danger" label="Delete Group" :disabled="isDeleteLoading" @click="confirmDeleteGroup" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>
