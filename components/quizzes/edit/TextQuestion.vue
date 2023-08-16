<script setup lang="ts">
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import type { TextQn } from '~/shared/quiz'

const props = defineProps<{
  modelValue: TextQn
}>()
const emit = defineEmits(['update:modelValue', 'delete'])

const editing = ref(false)
const state = ref(props.modelValue)
const card = ref()

onClickOutside(card, () => {
  editing.value = false
})

watch(state, (value) => {
  emit('update:modelValue', value)
}, { deep: true })
</script>

<template>
  <div>
    <Transition>
      <div v-if="editing" ref="card" flex flex-col gap-2>
        <InputText v-model="state.content" placeholder="Did you have fun today?" />
        <Textarea v-model="state.description" placeholder="Describe your experience" />
        <Divider :pt="{ root: { class: 'before:border-solid!' } }" />
        <div ml-auto>
          <Button size="small" text label="Delete question" severity="danger" @click="emit('delete')" />
        </div>
      </div>

      <QuizzesPreviewTextQuestion v-else :question="props.modelValue" @click="editing = true" />
    </Transition>
  </div>
</template>

<style scoped>
v-move,
.v-enter-active,
.v-leave-active {
  transition: all 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.v-leave-active {
  position: absolute;
}
</style>
