<script setup lang="ts">
// TODO skeleton and loading state, etc. general cleanup, again.

import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import type { AnyQuestion } from '~/shared/quiz'

const route = useRoute()
const { data: quiz } = useQuery(queries.quizzes.details(route.params.quizId as string))
const { data: initQns } = useQuery(queries.quizzes.details(route.params.quizId as string)._ctx.questions)

const questions = ref([...(initQns.value ?? [])])

watchEffect(() => {
  questions.value = [...(initQns.value ?? [])]
})

const DEFAULT_QUESTION: AnyQuestion = {
  type: 'Options',
  options: ['1'],
  correctOptions: [0],
  content: '',
  description: '',
  points: 0,
}

function addQuestion() {
  questions.value.push({
    id: '',
    quizId: '',
    ...DEFAULT_QUESTION,
  })
}
</script>

<template>
  <div p4 space-y-4 md:p8>
    <p class="mb-4 flex items-center gap-1.5 text-sm/6 font-semibold capitalize text-$primary-500">
      Edit quiz
    </p>
    <div flex items-center justify-between>
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {{ quiz?.name }}
      </h1>
      <Button label="Add question" size="small" @click="addQuestion" />
    </div>

    <div divide-y>
      <div v-for="question in questions" :key="question.id" py4>
        <div flex>
          <InputText v-model="question.content" size="small" placeholder="What is life?" class="w-full" />
          <Dropdown
            v-model="question.type" :options="[
              { label: 'Options', value: 'Options' },
              { label: 'Text', value: 'Text' },
              { label: 'File', value: 'File' },
            ]" option-label="label" option-value="value" class="min-w-[2rem] w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
