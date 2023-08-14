<script setup lang="ts">
import { RRule } from 'rrule'
import Sidebar from 'primevue/sidebar'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import type { DefaultEvent } from '~/shared/types'

const props = defineProps<{
  event: DefaultEvent
}>()
const route = useRoute()
const editMode = ref(false)
const visible = defineModel<boolean>('visible', { required: true })

const { mutate: updateEventMutate } = useUpdateEventMutation(route.params.groupId as string)
const { mutate: deleteMutate } = useDeleteEventMutation(route.params.groupId as string)

const today = new Date()
const freq = [
  { label: 'Day', value: RRule.DAILY },
  { label: 'Week', value: RRule.WEEKLY },
  { label: 'Month', value: RRule.MONTHLY },
  { label: 'Year', value: RRule.YEARLY },
]
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
    start: today,
    end: today,
  },
  recurrence: {
    enabled: false,
    freq: RRule.DAILY,
    interval: 1,
  },
  allDay: true,
  location: '',
})

watch(editMode, (e) => {
  if (e) {
    formData.name = props.event.name ?? ''
    formData.location = props.event.location ?? ''
    formData.range.start = props.event.startTime ?? today
    formData.range.end = props.event.endTime ?? today
    formData.allDay = props.event.allDay ?? true
    formData.recurrence.enabled = props.event.rrule !== null
    if (props.event.rrule) {
      const rrule = RRule.fromString(props.event.rrule)
      formData.recurrence.freq = rrule.options.freq ?? RRule.DAILY
      formData.recurrence.interval = rrule.options.interval ?? 1
      formData.recurrence.count = rrule.options.count ?? undefined
      formData.recurrence.until = rrule.options.until ?? undefined
    }
  }
})

watch(visible, (v) => {
  if (!v)
    editMode.value = false
})

function updateEvent() {
  let rrule: string | undefined
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
  updateEventMutate({
    eventId: props.event.id ?? '',
    name: formData.name,
    startTime: formData.range.start,
    endTime: formData.range.end,
    allDay: formData.allDay,
    location: formData.location,
    rrule,
  }, {
    onSuccess() {
      visible.value = false
    },
  })
}

function onEditClick() {
  editMode.value = true
}

function onDeleteClick() {
  if (props.event.id === undefined)
    return

  deleteMutate({
    eventId: props.event.id,
  },
  {
    onSuccess() {
      visible.value = false
    },
  })
}
</script>

<template>
  <Sidebar v-model:visible="visible" position="right" class="min-w-full md:min-w-lg">
    <div v-if="editMode" px4 space-y-8>
      <span>
        <h1 text-2xl font-bold tracking-tight>
          Edit event
        </h1>
        <p>Use events to keep track of important dates, such as exams, in your group.</p>
      </span>

      <VDatePicker v-model.range="formData.range" expanded title="left" :mode="formData.allDay ? 'date' : 'dateTime'" />

      <form space-y-8 @submit.prevent="updateEvent">
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

        <Button type="submit" label="Update" class="w-full" />
      </form>
    </div>

    <div v-else px4 space-y-4>
      <h1 text-2xl font-bold tracking-tight>
        {{ event?.name }}
      </h1>

      <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

      <div py2 space-y-2>
        <DashboardUpcomingEventsEventPropCard
          icon-class="i-tabler-map-pin"
          :label="event.location?.length === 0 ? 'No location' : event.location"
        />
        <div flex space-x-2>
          <DashboardUpcomingEventsEventPropCard
            icon-class="i-tabler-clock-play"
            :label="event?.allDay ? event?.startTime.toDateString() : event?.startTime.toLocaleString()"
          />
          <DashboardUpcomingEventsEventPropCard
            icon-class="i-tabler-clock-stop"
            :label="event?.allDay ? event?.endTime.toDateString() : event?.endTime.toLocaleString()"
          />
        </div>
      </div>

      <div flex pt2 space-x-2>
        <Button outlined label="Edit" class="w-full" @click="onEditClick" />
        <Button severity="danger" label="Delete" class="w-full" @click="onDeleteClick" />
      </div>
    </div>
  </Sidebar>
</template>
