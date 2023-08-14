<script setup lang="ts">
import Button from 'primevue/button'
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page'
import type { DefaultEvent } from '~/shared/types'

const props = defineProps<{
  groupId: string
}>()

const today = new Date()
const selectedDate = ref<Date>(today)
const createVisible = ref(false)
const viewVisible = ref(false)
const selectedEvent = ref<DefaultEvent | null>(null)

const { data: events, error: eventsError } = useUpcomingEvents(props.groupId, selectedDate)

const attributes = computed(() => {
  const a: object[] = [
    {
      key: 'today',
      dates: new Date(),
      highlight: true,
    },
  ]

  if (selectedDate.value) {
    if (selectedDate.value.getFullYear() !== today.getFullYear()
    || selectedDate.value.getMonth() !== today.getMonth()
    || selectedDate.value.getDate() !== today.getDate()) {
      a.push({
        key: 'selected',
        dates: selectedDate.value,
        bar: true,
      })
    }
  }

  return a
})

function handleDayclick(day: CalendarDay, event: MouseEvent) {
  selectedDate.value = day.date
}

function handleEventClick(event: DefaultEvent) {
  selectedEvent.value = event
  viewVisible.value = true
}
</script>

<template>
  <section max-w-sm w-sm space-y-4>
    <!-- TODO combine this with add event button -->
    <LazyDashboardUpcomingEventsCreateSidebar
      v-model:visible="createVisible"
      :date="selectedDate"
      :group-id="props.groupId"
    />

    <LazyDashboardUpcomingEventsViewSidebar
      v-model:visible="viewVisible"
      :event="selectedEvent!"
    />

    <div flex items-center justify-between>
      <h3 font-semibold>
        Upcoming Events / Deadlines
      </h3>
    </div>

    <!-- @vue-expect-error Bad types on attributes -->
    <VCalendar
      :attributes="
        attributes
      "
      @dayclick="handleDayclick"
    />

    <div v-if="events" space-y-2>
      <DashboardUpcomingEventsEventCard
        v-for="deadline in events.deadlines" :key="deadline.id"
        :name="deadline.name"
        :deadline="true"
        :end-date="deadline.dueDate"
      />
      <DashboardUpcomingEventsEventCard
        v-for="event in events.events" :key="event.id"
        :name="event.name"
        :deadline="false"
        :end-date="event.endTime"
        @click="handleEventClick(event)"
      />
    </div>

    <Button label="Add event" outlined size="small" @click="createVisible = true" />
  </section>
</template>
