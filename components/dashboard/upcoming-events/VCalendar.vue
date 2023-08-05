<script setup lang="ts">
import { Calendar } from 'v-calendar'
import 'v-calendar/dist/style.css'
import type { CalendarProps } from 'v-calendar/dist/types/src/use/calendar'

interface Props extends /* @vue-ignore */ Partial<CalendarProps> {}

// Prevent $attrs from being applied to <div> root
defineOptions({
  inheritAttrs: false,
})

defineProps<Props>()

// TODO hacky
const { cookieRaw } = useTheme()
const isDark = computed(() => cookieRaw.value?.includes('dark') ?? true)
</script>

<template>
  <div>
    <!-- div root for component scoped styles to be applied -->
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
  </div>
</template>

<style scoped>
:deep(button) {
  background-color: transparent;
}
</style>
