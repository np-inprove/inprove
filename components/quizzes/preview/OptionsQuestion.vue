<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import type { OptionsQn } from '~/shared/quiz'

const props = defineProps<{
  question: OptionsQn
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
      <ul space-y-2>
        <li v-for="option, idx in question.options" :key="idx" flex items-center gap3>
          <Checkbox disabled />
          {{ option }}
        </li>
      </ul>
    </CardContent>
  </Card>
</template>
