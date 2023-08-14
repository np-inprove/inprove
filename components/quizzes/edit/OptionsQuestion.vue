<script setup lang="ts">
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import type { OptionsQn } from '~/shared/quiz'

const props = defineProps<{
  modelValue: OptionsQn
}>()
const emit = defineEmits(['update:modelValue'])

const editing = ref(false)
const state = ref(props.modelValue)
const card = ref()

onClickOutside(card, () => {
  editing.value = false
})

watch(state, (value) => {
  emit('update:modelValue', value)
}, { deep: true })

function addOption() {
  state.value.options.push('')
}

function removeOption(idx: number) {
  state.value.options.splice(idx, 1)
}
</script>

<template>
  <div>
    <Transition>
      <div v-if="editing" ref="card" flex flex-col gap-2>
        <InputText v-model="state.content" placeholder="Did you have fun today?" />
        <Textarea v-model="state.description" placeholder="Describe your experience" />
        <ul mt4 space-y-2>
          <li v-for="option, idx in props.modelValue.options" :key="idx" flex items-center gap4>
            <Checkbox disabled />
            <InputText v-model="state.options[idx]" size="small" />
            <Button size="small" text severity="danger" @click="removeOption(idx)">
              <template #icon>
                <div i-tabler-trash />
              </template>
            </Button>
          </li>
        </ul>
        <div>
          <Button size="small" text label="Add option" @click="addOption" />
        </div>
      </div>

      <QuizzesPreviewOptionsQuestion v-else :question="props.modelValue" @click="editing = true" />
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
