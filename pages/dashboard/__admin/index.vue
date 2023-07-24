<script setup lang="ts">
import Column from 'primevue/column'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Skeleton from 'primevue/skeleton'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const router = useRouter()

const { data: institutions, isLoading: institutionsIsLoading, error: institutionsError, suspense } = useInstitutions()

const { mutate: createMutate } = useCreateInstitutionMutation()
const { mutate: deleteMutate } = useDeleteInstitutionMutation()
const { mutate: updateMutate } = useUpdateInstitutionMutation()

const createForm = reactive({
  visible: false,
  name: '',
})

const updateForm = reactive({
  visible: false,
  name: '',
  id: '',
})

function createInstitution() {
  createForm.visible = false
  createMutate(createForm, {
    onError(err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
      })
    },
    onSettled() {
      createForm.name = ''
    },
  })
}

function deleteInstitution(id: string) {
  deleteMutate({ id }, {
    onError(err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
      })
    },
  })
}

function updateInstitution() {
  updateForm.visible = false
  updateMutate(updateForm, {
    onError(err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
      })
    },
  })
}

function openUpdateForm(id: string) {
  updateForm.visible = true
  updateForm.id = id
  updateForm.name = institutions.value?.find(institution => institution.id === id)?.name ?? ''
}

function openInvites(id: string) {
  router.push({ path: '/dashboard/__admin/invites', query: { institutionId: id } })
}

await suspense()
</script>

<template>
  <div>
    <h2 text-lg font-medium>
      Institutions
    </h2>
    <p text-sm opacity-80>
      List of all institutions on iNProve
    </p>

    <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

    <Skeleton v-if="institutionsIsLoading" height="200px" />
    <ErrorCard v-else-if="institutionsError" v-bind="institutionsError" />
    <template v-else-if="institutions">
      <LazyWrapper>
        <Dialog v-model:visible="createForm.visible" modal header="New institution" class="min-w-sm">
          <form @submit.prevent="createInstitution">
            <div class="flex flex-col gap-2">
              <label for="name">Name</label>
              <InputText
                id="name" v-model="createForm.name" autofocus :required="true" placeholder="Big Learner Corp."
                aria-describedby="name-help"
              />
              <small id="name-help" class="sr-only">Enter the name of the institution</small>
            </div>

            <div mt6>
              <Button type="submit" size="small" label="Create" />
            </div>
          </form>
        </Dialog>

        <Dialog v-model:visible="updateForm.visible" modal header="Update institution" class="min-w-sm">
          <form @submit.prevent="updateInstitution">
            <div class="flex flex-col gap-2">
              <label for="name">Name</label>
              <InputText
                id="name" v-model="updateForm.name" autofocus :required="true" placeholder="Big Learner Corp."
                aria-describedby="name-help"
              />
              <small id="name-help" class="sr-only">Enter the name of the institution</small>
            </div>

            <div mt6>
              <Button type="submit" size="small" label="Update" />
            </div>
          </form>
        </Dialog>
      </LazyWrapper>

      <Card v-if="institutions?.length === 0">
        <template #title>
          No institutions available
        </template>
        <template #subtitle>
          No institutions have been created yet, make one now!
        </template>
        <template #content>
          <Button size="small" label="Create institution" @click="createForm.visible = true" />
        </template>
      </Card>

      <template v-else>
        <DataTable :value="institutions">
          <Column field="id" header="ID" style="width: 30%" />
          <Column field="name" header="Name" />
          <Column header="Actions" style="width: 25%">
            <template #body="slotProps">
              <div flex space-x-2>
                <Button size="small" label="Invites" @click="openInvites(slotProps.data.id)" />
                <Button size="small" text label="Edit" @click="openUpdateForm(slotProps.data.id)" />
                <Button size="small" text severity="danger" label="Delete" @click="deleteInstitution(slotProps.data.id)" />
              </div>
            </template>
          </Column>
        </DataTable>

        <div mt6>
          <Button size="small" label="Create institution" @click="createForm.visible = true" />
        </div>
      </template>
    </template>
  </div>
</template>
