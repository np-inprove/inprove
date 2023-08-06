<script setup lang="ts">
import { RRule } from 'rrule'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Sidebar from 'primevue/sidebar'
import InputText from 'primevue/inputtext'

const props = defineProps<{
  date: Date
  groupId: string
}>()

const formData = reactive({
  name: '',
  range: {
    start: props.date,
    end: props.date,
  },
  recurrence: {
    enabled: false,
    freq: RRule.DAILY,
    until: null,
    interval: 1,
  },
  allDay: true,
  location: '',
})

const visible = defineModel<boolean>('visible', { required: true })

const { mutate: createEventMutate } = useCreateEventMutation(props.groupId)

function createEvent() {
  createEventMutate({
    name: formData.name,
    startTime: formData.range.start,
    endTime: formData.range.end,
    location: formData.location,
    rrule: '',
  })
}

const freq = [
  { label: 'Daily', value: RRule.DAILY },
  { label: 'Weekly', value: RRule.WEEKLY },
  { label: 'Monthly', value: RRule.MONTHLY },
  { label: 'Yearly', value: RRule.YEARLY },
]

const recurrencePresets = computed(() => [
  {
    label: 'Daily',
    rrule: new RRule({
      freq: RRule.DAILY,
      interval: 1,
      dtstart: formData.range.start,
      until: formData.recurrence.until,
    }),
  },
])
</script>

<template>
  <Sidebar v-model:visible="visible" position="right" class="min-w-full md:min-w-md">
    <div px4>
      <h1 text-2xl font-bold tracking-tight>
        Create a new event
      </h1>
      <p>Use events to keep track of important dates, such as exams, in your group.</p>

      <form mt6 space-y-8 @submit.prevent="createEvent">
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

        <div v-if="formData.recurrence.enabled">
          <label for="location">Location</label>
          <InputText id="location" v-model="formData.location" size="small" aria-describedby="location-help" />
          <small id="location-help" sr-only>Enter a location for your event.</small>
        </div>

        <DashboardUpcomingEventsVDatePicker v-model.range="formData.range" expanded title="left" :mode="formData.allDay ? 'date' : 'dateTime'" />

        <Button type="submit" label="Create" class="w-full" />
      </form>
    </div>
  </Sidebar>
</template>
