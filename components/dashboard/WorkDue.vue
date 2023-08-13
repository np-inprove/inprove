<script setup lang="ts">
// TODO clean up this file

import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import add from 'date-fns/add/index'
import format from 'date-fns/format/index'

const props = defineProps<{
  groupId: string
}>()

const Dialog = defineAsyncComponent(() => import('primevue/dialog'))
const ScrollPanel = defineAsyncComponent(() => import('primevue/scrollpanel'))
const Calendar = defineAsyncComponent(() => import('primevue/calendar'))

const { data: deadlines, isLoading: deadlinesIsLoading, error: deadlinesError } = useDeadlines(props.groupId)
const { data: group } = useQuery(queries.groups.details(props.groupId))
const { mutate: createMutate } = useCreateDeadlineMutation(props.groupId)

const formData = reactive<{
  name: string
  dueDate: Date | null

  tempDueDateSelectedTimingIdx: number
  dueDateVisible: boolean
}>({
  name: '',
  dueDate: null,

  tempDueDateSelectedTimingIdx: -1,
  dueDateVisible: false,
})

function createDeadline() {
  createMutate(formData, {
    onSuccess() {
      formData.name = ''
      formData.dueDate = null
    },
  })
}

const base = new Date(2004, 8, 14, 0, 0, 0, 0)

const timings = Array.from({ length: 48 }).map((_, idx) => format(add(base, { minutes: idx * 30 }), 'HH:mm'))

function selectTiming(idx: number) {
  if (idx === formData.tempDueDateSelectedTimingIdx)
    formData.tempDueDateSelectedTimingIdx = -1
  else
    formData.tempDueDateSelectedTimingIdx = idx
}

function addDueDate() {
  formData.dueDateVisible = false
  if (!formData.dueDate)
    return

  formData.dueDate.setHours(0, 0, 0, 0)
  formData.dueDate = add(formData.dueDate, { minutes: formData.tempDueDateSelectedTimingIdx * 30 })
}
</script>

<template>
  <div space-y-2>
    <Dialog v-model:visible="formData.dueDateVisible" header="Set due date" modal class="min-w-sm">
      <div grid="~ cols-1 md:cols-2 gap4">
        <Calendar v-model="formData.dueDate" inline hour-format="12" :min-date="new Date()" />
        <ScrollPanel class="h-200px w-full md:h-359px">
          <div
            v-for="timing, idx in timings" :key="idx" rounded p2
            :class="{
              'bg-$highlight-bg': idx === formData.tempDueDateSelectedTimingIdx,
              'hover:bg-$surface-hover': idx !== formData.tempDueDateSelectedTimingIdx,
            }"
            @click="selectTiming(idx)"
          >
            {{ timing }}
          </div>
        </ScrollPanel>
      </div>
      <template #footer>
        <div flex justify-between>
          <Button size="small" label="Clear" text raised @click="formData.dueDate = null; formData.dueDateVisible = false" />
          <Button size="small" label="Done" @click="addDueDate()" />
        </div>
      </template>
    </Dialog>

    <form flex items-center space-x-3 @submit.prevent="createDeadline">
      <InputText
        id="task" v-model="formData.name" :pt="{
          root: {
            class: 'border-none! shadow-none! rounded-md bg-$surface-card!',
          },
        }" size="small" class="flex-1" autofocus :required="true" :placeholder="`Add deadline to ${group?.name}`"
      />

      <Button
        size="small" :label="
          formData.dueDate
            ? format(formData.dueDate, 'MMM d, yyyy HH:mm')
            : 'Set due date'
        " raised text @click="formData.dueDateVisible = true"
      />
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
