<script setup lang="ts">
import type { OptionsAnswerState } from '~/shared/quiz'

const props = defineProps<{
  modelValue: OptionsAnswerState
}>()
const emit = defineEmits(['update:modelValue'])

const state = ref(props.modelValue)

watch(state, (value) => {
  emit('update:modelValue', value)
}, { deep: true })
</script>

<template>
  <div flex flex-col gap-2>
    {{ props.modelValue }}
  </div>
</template>
