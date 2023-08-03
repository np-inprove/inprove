<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'

const props = defineProps<{
  groupId: string
}>()

const { data: events, isLoading: eventsIsLoading, error: eventsError } = useUpcomingEvents(props.groupId)
</script>

<template>
  <div>
    <Skeleton v-if="eventsIsLoading" height="300px" />
    <div v-else>
      <DashboardUpcomingEventsVCalendar />

      <NuxtLink prefetch :to="`/dashboard/${props.groupId}/events/new`">
        <Button label="Create" />
      </NuxtLink>
    </div>
  </div>
</template>
