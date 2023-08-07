<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import 'v-calendar/dist/style.css'
import type { CalendarProps } from 'v-calendar/dist/types/src/use/calendar'

// Prevent $attrs from being applied to <div> root
defineOptions({
  inheritAttrs: false,
})

defineProps<Props>()

const Calendar = defineAsyncComponent(() => import('v-calendar').then(m => m.Calendar))

interface Props extends /* @vue-ignore */ Partial<CalendarProps> {}

// TODO hacky
const { cookieRaw } = useTheme()
const isDark = computed(() => cookieRaw.value?.includes('dark') ?? true)
</script>

<template>
  <div>
    <!-- div root for component scoped styles to be applied -->
    <ClientOnly>
      <template #fallback>
        <Skeleton height="110px" />
      </template>
      <Calendar
        title-position="left"
        borderless
        transparent
        expanded
        :min-date="new Date()"
        :is-dark="isDark"
        view="weekly"
        v-bind="$attrs"
      />
    </ClientOnly>
  </div>
</template>

<style scoped>
:deep(button) {
  background-color: transparent;
}
</style>
