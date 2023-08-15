<script setup lang="ts">
import Divider from 'primevue/divider'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'
import Dropdown from 'primevue/dropdown'
import type { DefaultGroupUsers, DetailedGroupUsers } from '~/shared/types'
import { GroupRole } from '~/shared/enums'

const route = useRoute()
const confirm = useConfirm()
const groupId = route.params.groupId as string
const { data: me } = useQuery(queries.groupUsers.me(groupId))
const { data: groupUsers, isLoading: usersIsLoading, error: usersError } = useQuery(queries.groupUsers.list(groupId))
const { mutate: updateMutate, isLoading: isUpdateLoading } = useUpdateGroupUserMutation()
const { mutate: removeMutate } = useRemoveGroupUserMutation()

const roles = computed(() => {
  if (me.value?.role === GroupRole.Owner) {
    return [
      'Owner',
      'Educator',
      'Member',
    ]
  }
  if (me.value?.role === GroupRole.Educator) {
    return [
      'Educator',
      'Member',
    ]
  }
})

function canEditRole(groupUser: DefaultGroupUsers) {
  if (me.value?.userId === groupUser.userId)
    return false
  if (me.value?.role === GroupRole.Owner)
    return true
  if (me.value?.role === GroupRole.Educator && groupUser.role !== GroupRole.Owner)
    return true
}

function dropdownChange(event: any, userId: string) {
  const role = event.value
  updateMutate({
    groupId,
    userId,
    role,
  })
}

function removeGroupUser(userId: string) {
  removeMutate({
    groupId,
    userId,
  })
}

function confirmDeleteGroupUser(groupUser: DetailedGroupUsers) {
  confirm.require({
    message: `Are you sure you want to remove ${groupUser.user.name}?`,
    header: 'Removal Confirmation',
    icon: 'i-tabler-alert-circle',
    acceptClass: 'p-button-danger',
    accept: () => {
      removeGroupUser(groupUser.userId)
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
          Users
        </h2>
        <p text-sm opacity-80>
          List of users in the group
        </p>
      </div>
    </div>

    <!-- For some reason, the divider does not appear -->
    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <Skeleton v-if="usersIsLoading" height="300px" />
    <LazyErrorCard v-else-if="usersError" v-bind="usersError" />

    <template v-else>
      <DataTable :value="groupUsers">
        <Column field="user.name" header="Name" sortable />
        <Column field="role" header="Role" sortable>
          <template #body="bodySlot">
            <Dropdown
              v-if="canEditRole(bodySlot.data)"
              v-model="bodySlot.data.role"
              :disabled="isUpdateLoading"
              :options="roles"
              class="w-full md:w-14rem"
              @change="(event: any) => dropdownChange(event, bodySlot.data.userId)"
            />
            <div v-else>
              {{ bodySlot.data.role }}
            </div>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="bodySlot">
            <Button icon="" text severity="danger" @click="confirmDeleteGroupUser(bodySlot.data)">
              <div i-tabler-x />
            </Button>
          </template>
        </Column>
      </DataTable>
    </template>
  </div>
</template>
