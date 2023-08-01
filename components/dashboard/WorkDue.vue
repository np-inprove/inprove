<script setup lang="ts">
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'
import Inplace from 'primevue/inplace'
import Button from 'primevue/button'

const props = defineProps<{
  groupId: string
}>()

const { data: deadlines, isLoading: deadlinesIsLoading, error: deadlinesError } = useDeadlines(props.groupId)
const { data: group } = useGroup(props.groupId)
const { mutate: createMutate } = useCreateDeadlineMutation(props.groupId)

const formData = reactive({
  name: '',
  dueDate: new Date(),
})

function createDeadline() {
  createMutate(formData)
}
</script>

<template>
  <div space-y-2>
    <form flex items-center space-x-3 @submit.prevent="createDeadline">
      <InputText
        id="task" v-model="formData.name" :pt="{
          root: {
            class: 'border-none! shadow-none! rounded-md bg-$surface-card!',
          },
        }" size="small" class="flex-1" autofocus :required="true" :placeholder="`Add deadline to ${group?.name}`"
      />
      <Inplace>
        <template #display>
          <Button size="small" label="Due date" outlined />
        </template>
        <template #content>
          <Calendar v-model="formData.dueDate" show-time hour-format="12" />
        </template>
      </Inplace>
    </form>

    <div class="rounded-md bg-$surface-card shadow-md">
      <template v-if="deadlines">
        <div v-if="deadlines.length === 0">
          <div class="p-4">
            <p class="text-center text-$text-color-secondary">
              No work due
            </p>
          </div>
        </div>
        <div v-else divide-y>
          <DashboardWorkDueItem
            v-for="deadline in deadlines" :key="deadline.id" v-bind="deadline"
            :author-name="deadline.author?.name ?? ''"
          />
        </div>
      </template>
    </div>
  </div>
</template>
