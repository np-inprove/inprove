<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import { Calendar } from 'v-calendar'

const props = defineProps<{
  groupId: string
}>()

const { data: events, isLoading: eventsIsLoading, error: eventsError } = useUpcomingEvents(props.groupId)

const { cookieRaw } = useTheme()
const isDark = computed(() => cookieRaw.value?.includes('dark') ?? true)
const attributes = computed(() => events.value?.map(e => ({
  highlight: true,
  dates: {
    start: e.startTime,
    repeat: e.repeat,
  },
})) ?? undefined)
</script>

<template>
  <div>
    <Skeleton v-if="eventsIsLoading" height="300px" />
    <div v-else>
      <Calendar :attributes="attributes" title-position="left" borderless transparent expanded :is-dark="isDark" />

      <NuxtLink prefetch :to="`/dashboard/${props.groupId}/events/new`">
        <Button label="Create" />
      </NuxtLink>
    </div>
  </div>
</template>

<style>
@import 'v-calendar/style.css';
</style>
