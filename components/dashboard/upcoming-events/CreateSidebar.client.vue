<script setup lang="ts">
import { RRule } from 'rrule'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Sidebar from 'primevue/sidebar'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'

const props = defineProps<{
  date: Date
  groupId: string
}>()

const formData = reactive<{
  name: string
  range: {
    start: Date
    end: Date
  }
  recurrence: {
    enabled: boolean
    freq: number
    interval: number
    count?: number
    until?: Date
  }
  allDay: boolean
  location: string
}>({
  name: '',
  range: {
    start: props.date,
    end: props.date,
  },
  recurrence: {
    enabled: false,
    freq: RRule.DAILY,
    interval: 1,
  },
  allDay: true,
  location: '',
})

const visible = defineModel<boolean>('visible', { required: true })

const { mutate: createEventMutate } = useCreateEventMutation(props.groupId, onCreateEventSuccess)

function createEvent() {
  let rrule = ''
  if (formData.recurrence.enabled) {
    const t = new RRule({
      freq: formData.recurrence.freq,
      interval: formData.recurrence.interval,
      dtstart: formData.range.start,
      until: formData.recurrence.until,
      count: formData.recurrence.count,
    })
    rrule = t.toString()
  }
  createEventMutate({
    name: formData.name,
    startTime: formData.range.start,
    endTime: formData.range.end,
    location: formData.location,
    rrule,
  })
}

function onCreateEventSuccess() {
  visible.value = false
}

const freq = [
  { label: 'Day', value: RRule.DAILY },
  { label: 'Week', value: RRule.WEEKLY },
  { label: 'Month', value: RRule.MONTHLY },
  { label: 'Year', value: RRule.YEARLY },
]
</script>

<template>
  <Sidebar v-model:visible="visible" position="right" class="min-w-full md:min-w-lg">
    <div px4 space-y-8>
      <span>
        <h1 text-2xl font-bold tracking-tight>
          Create a new event
        </h1>
        <p>Use events to keep track of important dates, such as exams, in your group.</p>
      </span>

      <VDatePicker v-model.range="formData.range" expanded title="left" :mode="formData.allDay ? 'date' : 'dateTime'" />

      <form space-y-8 @submit.prevent="createEvent">
        <div class="flex flex-col gap-2">
          <label for="name">Name</label>
          <InputText id="name" v-model="formData.name" size="small" aria-describedby="name-help" autofocus />
          <small id="name-help" sr-only>Enter a name or description for your event.</small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="location">Location</label>
          <InputText id="location" v-model="formData.location" size="small" aria-describedby="location-help" />
          <small id="location-help" sr-only>Enter a location for your event.</small>
        </div>

        <div class="flex items-center justify-between">
          <label for="allDay">All day</label>
          <Checkbox id="allDay" v-model="formData.allDay" size="small" aria-describedby="allDay-help" :binary="true" />
          <small id="allDay-help" sr-only>Indicate whether the event is all day</small>
        </div>

        <div class="flex items-center justify-between">
          <label for="recurring">Recurring event</label>
          <Checkbox id="recurring" v-model="formData.recurrence.enabled" size="small" aria-describedby="recurring-help" :binary="true" />
          <small id="recurring-help" sr-only>Indicate whether the event is all day</small>
        </div>

        <div v-if="formData.recurrence.enabled" space-y-4>
          <!-- Recurrence options -->

          <div flex items-center justify-between>
            <label for="freq">Every</label>
            <Dropdown v-model="formData.recurrence.freq" :options="freq" option-label="label" option-value="value" />
            <small id="freq-help" sr-only>Enter a frequency for the recurrence</small>
          </div>

          <div flex items-center justify-between>
            <label for="interval">Interval</label>
            <InputNumber id="interval" v-model="formData.recurrence.interval" size="small" aria-describedby="interval-help" />
            <small id="interval-help" sr-only>Enter an interval for the recurrence</small>
          </div>

          <div flex items-center justify-between>
            <label for="until">Until</label>
            <Button size="small" text :label="formData.recurrence.until ? 'Remove' : 'Add'" @click="formData.recurrence.until = formData.recurrence.until ? undefined : new Date()" />
            <small id="until-help" sr-only>Enter a date that the recurrence should run until</small>
          </div>

          <VDatePicker v-if="formData.recurrence.until" v-model="formData.recurrence.until" mode="date" />

          <div flex items-center justify-between>
            <label for="count">Count (optional)</label>
            <InputNumber v-model="formData.recurrence.count" size="small" aria-describedby="count-help" />
            <small id="count-help" sr-only>Enter the number of times the recurrence should run</small>
          </div>
        </div>

        <Button type="submit" label="Create" class="w-full" />
      </form>
    </div>
  </Sidebar>
</template>
