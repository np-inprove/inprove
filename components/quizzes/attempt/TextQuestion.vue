<script setup lang="ts">
import type { TextAnswerState } from '~/shared/quiz'

const props = defineProps<{
  modelValue: TextAnswerState
}>()
const emit = defineEmits(['update:modelValue'])

const state = ref(props.modelValue)

watch(state, (value) => {
  emit('update:modelValue', value)
}, { deep: true })
</script>

<template>
  <div flex flex-col gap-2>
    {{ props }}
  </div>
</template>
