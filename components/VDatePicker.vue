<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import 'v-calendar/dist/style.css'
import type { CalendarProps } from 'v-calendar/dist/types/src/use/calendar'

// Prevent $attrs from being applied to <div> root
defineOptions({
  inheritAttrs: false,
})

defineProps<Props>()

const DatePicker = defineAsyncComponent(() => import('v-calendar').then(m => m.DatePicker))

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
      <DatePicker
        title-position="left"

        expanded borderless transparent
        :min-date="new Date()"
        :is-dark="isDark"
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
