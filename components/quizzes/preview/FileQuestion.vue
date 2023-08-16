<script setup lang="ts">
import FileUpload from 'primevue/fileupload'
import type { FileQn } from '~/shared/quiz'

const props = defineProps<{
  question: FileQn
}>()
const emit = defineEmits(['click'])
</script>

<template>
  <Card class="rounded-md bg-transparent hover:bg-$surface-a" @click="emit('click', $event)">
    <CardHeader>
      <CardTitle>
        {{ props.question.content }}
      </CardTitle>
      <CardDescription>
        {{ props.question.description }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <FileUpload name="files[]" disabled>
        <template #empty>
          <p opacity-75>
            Drag and drop files to here to upload.
          </p>
        </template>
      </FileUpload>
    </CardContent>
  </Card>
</template>
