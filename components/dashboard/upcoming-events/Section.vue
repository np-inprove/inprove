<script setup lang="ts">
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page'

const props = defineProps<{
  groupId: string
}>()

const selectedDate = ref<Date>()

const attributes = computed(() => {
  const today = new Date()
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
    <LazyDashboardUpcomingEventsCreateSidebar v-model:visible="visible" />

    <div flex items-center justify-between>
      <h3 font-semibold>
        Upcoming events
      </h3>
    </div>

    <ClientOnly>
      <template #fallback>
        <Skeleton height="110px" />
      </template>
      <!-- @vue-expect-error Bad types on attributes -->
      <DashboardUpcomingEventsVCalendar
        :attributes="
          attributes
        "
        @dayclick="handleDayclick"
      />
    </ClientOnly>

    <div v-if="events" space-y-1>
      <DashboardUpcomingEventsEventCard
        v-for="deadline in events.deadlines" :key="deadline.id"
        :name="deadline.name"
        :deadline="true"
        :end-date="deadline.dueDate"
      />
    </div>

    <Button label="Add event" outlined size="small" @click="visible = true" />
  </section>
</template>
