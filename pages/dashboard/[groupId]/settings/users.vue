<script setup lang="ts">
import Divider from 'primevue/divider'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

const route = useRoute()
const groupId = route.params.groupId as string
const { data: groupUsers, isLoading: usersIsLoading, error: usersError } = useQuery(queries.groupUsers.list(groupId))
const { mutate: removeMutate } = useRemoveGroupUserMutation()

function removeGroupUser(userId: string) {
  removeMutate({
    groupId,
    userId,
  })
}
</script>

<template>
  <div>
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
        <Column field="role" header="Role" sortable />
        <Column header="Actions">
          <template #body="bodySlot">
            <Button icon="" text severity="danger" @click="removeGroupUser(bodySlot.data.userId)">
              <div i-tabler-x />
            </Button>
          </template>
        </Column>
      </DataTable>
    </template>
  </div>
</template>
