<script setup lang="ts">
import { DatePicker } from 'v-calendar'
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
    <DatePicker
      title-position="left"

      expanded borderless transparent
      :min-date="new Date()"
      :is-dark="isDark"
      v-bind="$attrs"
    />
  </div>
</template>

<style scoped>
:deep(button) {
  background-color: transparent;
}
</style>
