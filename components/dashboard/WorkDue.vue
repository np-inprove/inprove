<script setup lang="ts">
import Calendar from 'primevue/calendar'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  groupId: string
}>()

const { data: deadlines, isLoading: deadlinesIsLoading, error: deadlinesError } = useDeadlines(props.groupId)
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
  <div class="rounded-md bg-$surface-card shadow-md">
    <form flex flex-wrap @submit.prevent="createDeadline">
      <InputText v-model="formData.name" />
      <Calendar v-model="formData.dueDate" show-time hour-format="12" />
      <button type="submit">
        fu
      </button>
    </form>

    <template v-if="deadlines">
      <div v-if="deadlines.length === 0">
        <div class="p-4">
          <p class="text-center text-$text-color-secondary">
            No work due
          </p>
        </div>
      </div>
      <div v-else />
      {{ deadlines }}
    </template>
  </div>
</template>
