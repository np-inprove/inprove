<script setup lang="ts">
import Card from 'primevue/card'

const props = defineProps<{
  message?: string
  data?: any
}>()
</script>

<template>
  <Card class="max-w-lg">
    <template #title>
      There's been a glitch in the matrix...
    </template>
    <template #subtitle>
      <div class="text-$red-600">
        Beep boop, something went ww-w-w-rong. Please try again later!
      </div>
    </template>
    <template #content>
      <details v-if="props.data">
        <p break-all>
          {{ props.data }}
        </p>
      </details>
    </template>
  </Card>
</template>
