<script setup lang="ts">
import Menu from 'primevue/menu'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Card from 'primevue/card'
import { useQuery } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const toast = useToast()
const { $client } = useNuxtApp()

const { mutate: createMutate } = useCreateInstitutionInviteMutation()
const { mutate: deleteMutate } = useDeleteInstitutionInviteMutation()

const menu = ref()
const menuItems = [
  {
    label: 'Admin',
    command: () => {
      createMutate({
        institutionId: route.query.institutionId as string,
        role: 'Admin',
      })
    },
  },
  {
    label: 'Educator',
    command: () => {
      createMutate({
        institutionId: route.query.institutionId as string,
        role: 'Educator',
      })
    },
  },
  {
    label: 'Member',
    command: () => {
      createMutate({
        institutionId: route.query.institutionId as string,
        role: 'Member',
      })
    },
  },
]

const { data: invites, isLoading: invitesIsLoading, error: invitesError, suspense } = useQuery({
  queryKey: ['institutions', route.query.institutionId, 'invites'],
  queryFn: () => $client.institutionInvite.list.query({ institutionId: route.query.institutionId as string }),
  enabled: !!route.query.institutionId,
})

function deleteInvite(id: string) {
  deleteMutate({
    institutionId: route.query.institutionId as string,
    inviteId: id,
  })
}

async function copyInvite(id: string) {
  await window.navigator.clipboard.writeText(`${window.location.origin}/s/${id}`)
  toast.add({
    summary: 'Copied to clipboard',
    detail: 'Share the link with someone!',
    life: 3000,
  })
}

if (route.query.institutionId)
  await suspense()
</script>

<template>
  <div>
    <div flex justify-between>
      <div>
        <h2 text-lg font-medium>
          Invite links
        </h2>
        <p text-sm opacity-80>
          List of institution invite links on iNProve
        </p>
      </div>

      <LazyWrapper v-if="invites">
        <div>
          <Button
            type="button" label="New" size="small" aria-haspopup="true" aria-controls="overlay_menu"
            @click="menu.toggle($event)"
          />
        </div>
        <Menu id="overlay_menu" ref="menu" :model="menuItems" :popup="true" />
      </LazyWrapper>
    </div>

    <!-- For some reason, the divider does not appear -->
    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <Card v-if="!route.query.institutionId" class="max-w-xl">
      <template #title>
        Please select an institution to view invites.
      </template>
      <template #content>
        <Button size="small" label="View institutions" @click="$router.push('/dashboard/__admin')" />
      </template>
    </Card>

    <Skeleton v-else-if="invitesIsLoading" height="300px" />
    <ErrorCard v-else-if="invitesError" v-bind="invitesError" />

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
