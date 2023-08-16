<script setup lang="ts">
import Textarea from 'primevue/textarea'
import type { TextQn } from '~/shared/quiz'

const props = defineProps<{
  question: TextQn
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
      <Textarea class="w-full" disabled placeholder="Lorem ipsum dolor sit amet" />
    </CardContent>
  </Card>
</template>
