<script setup lang="ts">
import Menu from 'primevue/menu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Skeleton from 'primevue/skeleton'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Card from 'primevue/card'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const toast = useToast()

const { mutate: createMutate } = useCreateGroupInviteMutation()
const { mutate: deleteMutate } = useDeleteGroupInviteMutation()

const menu = ref()
const menuItems = [
  {
    label: 'Owner',
    command: () => {
      createMutate({
        role: 'Owner',
        groupId: route.params.groupId as string,
      })
    },
  },
  {
    label: 'Educator',
    command: () => {
      createMutate({
        role: 'Educator',
        groupId: route.params.groupId as string,
      })
    },
  },
  {
    label: 'Member',
    command: () => {
      createMutate({
        role: 'Member',
        groupId: route.params.groupId as string,
      })
    },
  },
]

const { data: invites, isLoading: invitesIsLoading, error: invitesError } = useQuery(queries.groupInvites.list(route.params.groupId as string))

function deleteInvite(id: string) {
  deleteMutate({
    inviteId: id,
    groupId: route.params.groupId as string,
  })
}

async function copyInvite(id: string) {
  await window.navigator.clipboard.writeText(`${window.location.origin}/g/${id}`)
  toast.add({
    summary: 'Copied to clipboard',
    detail: 'Share the link with someone!',
    life: 3000,
  })
}
</script>

<template>
  <div>
    <Toast />

    <div flex justify-between>
      <div>
        <h2 text-lg font-medium>
          Invite links
        </h2>
        <p text-sm opacity-80>
          List of institution invite links on iNProve
        </p>
      </div>

      <template v-if="invites">
        <div>
          <Button
            type="button" label="New" size="small" aria-haspopup="true" aria-controls="overlay_menu"
            @click="menu.toggle($event)"
          />
        </div>
        <Menu id="overlay_menu" ref="menu" :model="menuItems" :popup="true" />
      </template>
    </div>

    <!-- For some reason, the divider does not appear -->
    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <Skeleton v-if="invitesIsLoading" height="300px" />
    <LazyErrorCard v-else-if="invitesError" v-bind="invitesError" />

    <template v-else>
      <Card v-if="invites?.length === 0">
        <template #title>
          No invites available
        </template>
        <template #subtitle>
          No invites have been created yet, make one now!
        </template>
      </Card>

      <DataTable v-else :value="invites">
        <Column field="id" header="ID" />
        <Column field="role" header="Role" sortable style="width: 50%" />
        <Column header="Actions">
          <template #body="bodySlot">
            <Button icon="" text @click="copyInvite(bodySlot.data.id)">
              <div i-tabler-copy />
            </Button>
            <Button icon="" text severity="danger" @click="deleteInvite(bodySlot.data.id)">
              <div i-tabler-trash />
            </Button>
          </template>
        </Column>
      </DataTable>
    </template>
  </div>
</template>
