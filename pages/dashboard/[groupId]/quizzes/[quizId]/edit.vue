<script setup lang="ts">
// TODO skeleton and loading state, etc. general cleanup, again.

import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { QuestionType } from '~/shared/enums'
import { fileQn, optionsQn, textQn } from '~/shared/quiz'
import type { CombinedQuestion, OptionsQn, QuizState } from '~/shared/quiz'

const route = useRoute()
const { data: quiz } = useQuery(queries.quizzes.details(route.params.quizId as string))
const { data: qns } = useQuery(queries.quizzes.details(route.params.quizId as string)._ctx.questions)

const qz = ref<QuizState>({
  questions: [],
})

watchEffect(() => {
  qz.value.questions = [...(qns.value ?? [])]
})

const DEFAULT_QUESTIONS: Record<keyof typeof QuestionType, CombinedQuestion> = {
  [QuestionType.Options]: {
    type: QuestionType.Options,
    options: ['Option 1', 'Option 2'],
    correctOptions: [0],
    content: 'Question',
    description: 'Description',
    points: 0,
  },
  [QuestionType.Text]: {
    type: QuestionType.Text,
    content: 'Question',
    description: 'Description',
    points: 0,
    answer: '',
  },
  [QuestionType.File]: {
    type: QuestionType.File,
    content: 'Question',
    description: 'Description',
    points: 0,
  },
}

function addQuestion() {
  qz.value.questions.push(DEFAULT_QUESTIONS.Text)
}

function updateQuestionType(idx: number, value: QuestionType) {
  qz.value.questions[idx] = DEFAULT_QUESTIONS[value]
}

function bindOptionsQn(qn: CombinedQuestion) {
  return {
    'modelValue': optionsQn.parse(qn),
    'onUpdate:modelValue': (value: OptionsQn) => {
      qz.value.questions[qz.value.questions.indexOf(qn)] = value
    },
  }
}

function bindFileQn(qn: CombinedQuestion) {
  return {
    'modelValue': fileQn.parse(qn),
    'onUpdate:modelValue': (value: CombinedQuestion) => {
      qz.value.questions[qz.value.questions.indexOf(qn)] = value
    },
  }
}

function bindTextQn(qn: CombinedQuestion) {
  return {
    'modelValue': textQn.parse(qn),
    'onUpdate:modelValue': (value: CombinedQuestion) => {
      qz.value.questions[qz.value.questions.indexOf(qn)] = value
    },
  }
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
      <div v-if="qz.questions.length === 0" mt10>
        <Card>
          <CardHeader class="text-center">
            <CardTitle>
              No questions yet!
            </CardTitle>
            <CardDescription>
              Add a new question
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div v-for="(question, idx) in qz.questions" v-else :key="question.id" py4>
        <LazyQuizzesEditFileQuestion v-if="qz.questions[idx].type === QuestionType.File" v-bind="bindFileQn(qz.questions[idx])" />
        <LazyQuizzesEditOptionsQuestion v-if="qz.questions[idx].type === QuestionType.Options" v-bind="bindOptionsQn(qz.questions[idx])" />
        <LazyQuizzesEditTextQuestion v-if="qz.questions[idx].type === QuestionType.Text" v-bind="bindTextQn(qz.questions[idx])" />

        <div>
          <Dropdown
            :model-value="question.type"
            size="small"
            :options="[
              { label: 'Options', value: 'Options' },
              { label: 'Text', value: 'Text' },
              { label: 'File', value: 'File' },
            ]" option-label="label" option-value="value" class="w-xs" @update:modelValue="updateQuestionType(idx, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
