<script setup lang="ts">
import { Calendar } from 'v-calendar'
import 'v-calendar/dist/style.css'

const attrs = ref([
  {
    key: 'today',
    highlight: true,
    dates: new Date(),
  },
])

const { cookieRaw } = useTheme()
const isDark = computed(() => cookieRaw.value?.includes('dark') ?? true)
</script>

<template>
  <div>
    <Calendar
      :attributes="
        attrs
      " title-position="left" borderless transparent expanded :is-dark="isDark"
    />
  </div>
</template>

<style scoped>
:deep(button) {
  background-color: transparent;
}
</style>
