<script setup lang="ts">
import Button from 'primevue/button'
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page'

const props = defineProps<{
  groupId: string
}>()

const today = new Date()
const selectedDate = ref<Date>(today)

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

const { data: events, error: eventsError } = useUpcomingEvents(props.groupId, selectedDate)

function handleDayclick(day: CalendarDay, event: MouseEvent) {
  selectedDate.value = day.date
}

const visible = ref(false)
</script>

<template>
  <section max-w-sm w-sm space-y-4>
    <!-- TODO combine this with add event button -->
    <LazyDashboardUpcomingEventsCreateSidebar
      v-model:visible="visible"
      :date="selectedDate"
      :group-id="props.groupId"
    />

    <div flex items-center justify-between>
      <h3 font-semibold>
        Upcoming events
      </h3>
    </div>

    <!-- @vue-expect-error Bad types on attributes -->
    <VCalendar
      :attributes="
        attributes
      "
      @dayclick="handleDayclick"
    />

    <div v-if="events" space-y-1>
      <DashboardUpcomingEventsEventCard
        v-for="deadline in events.deadlines" :key="deadline.id"
        :name="deadline.name"
        :deadline="true"
        :end-date="deadline.dueDate"
      />
      <DashboardUpcomingEventsEventCard
        v-for="deadline in events.events" :key="deadline.id"
        :name="deadline.name"
        :deadline="true"
        :end-date="deadline.endTime"
      />
    </div>

    <Button label="Add event" outlined size="small" @click="visible = true" />
  </section>
</template>
