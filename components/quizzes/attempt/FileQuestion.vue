<script setup lang="ts">
import FileUpload from 'primevue/fileupload'
import type { FileUploadUploaderEvent } from 'primevue/fileupload'
import type { FileAnswerState } from '~/shared/quiz'

const props = defineProps<{
  modelValue: FileAnswerState
}>()
const emit = defineEmits(['update:modelValue'])

const state = ref(props.modelValue)

watch(state, (value) => {
  emit('update:modelValue', value)
}, { deep: true })

async function upload(event: FileUploadUploaderEvent) {
  const file = Array.isArray(event.files) ? event.files[0] : event.files
  // TODO file upload to r2
}
</script>

<template>
  <div flex flex-col gap-2>
    <FileUpload mode="basic" :show-upload-button="false" name="file[]" :file-limit="1" :max-file-size="1000000" custom-upload @uploader="upload($event)" />
  </div>
</template>
