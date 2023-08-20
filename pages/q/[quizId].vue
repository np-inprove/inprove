<script setup lang="ts">
import Divider from 'primevue/divider'
import { QuestionType } from '~/shared/enums'
import { type CombinedAnswerState, fileAnswerState, optionsAnswerState, textAnswerState } from '~/shared/quiz'

const route = useRoute()

const { data: quiz } = useQuery(queries.quizzes.details(route.params.quizId as string))
const { data: questions } = useQuery(queries.quizzes.details(route.params.quizId as string)._ctx.questions)

const formData = ref<CombinedAnswerState[]>([])

watch(questions, (value) => {
  if (!value)
    return

  formData.value = value.map((qn) => {
    switch (qn.type) {
      case QuestionType.Options:
        return {
          ...qn,
          options: [] as number[],
          type: QuestionType.Options,
        }
      case QuestionType.File:
        return {
          ...qn,
          type: QuestionType.File,
        }
      case QuestionType.Text:
        return {
          ...qn,
          answer: '',
          type: QuestionType.Text,
        }
      default:
        throw new Error('invariant')
    }
  })
})

function bindOptionsQn(qn: CombinedAnswerState) {
  return {
    'modelValue': optionsAnswerState.parse(qn),
    'onUpdate:modelValue': (value: CombinedAnswerState) => {
      formData.value[formData.value.indexOf(qn)] = value
    },
  }
}

function bindFileQn(qn: CombinedAnswerState) {
  return {
    'modelValue': fileAnswerState.parse(qn),
    'onUpdate:modelValue': (value: CombinedAnswerState) => {
      formData.value[formData.value.indexOf(qn)] = value
    },
  }
}

function bindTextQn(qn: CombinedAnswerState) {
  return {
    'modelValue': textAnswerState.parse(qn),
    'onUpdate:modelValue': (value: CombinedAnswerState) => {
      formData.value[formData.value.indexOf(qn)] = value
    },
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div mx-auto my-10 px6 py10 container>
      <p class="mb-4 flex items-center gap-1.5 text-sm/6 font-semibold capitalize text-$primary-color">
        iNProve Quiz
      </p>
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {{ quiz?.name }}
      </h1>
      <p class="leading-7 [&:not(:first-child)]:mt-6">
        {{ quiz?.description }}
      </p>

      <Divider />

      <div v-for="question, idx in formData" :key="idx">
        <QuizzesAttemptOptionsQuestion v-if="question.type === QuestionType.Options" v-bind="bindOptionsQn(question)" />
        <QuizzesAttemptFileQuestion v-if="question.type === QuestionType.File" v-bind="bindFileQn(question)" />
        <QuizzesAttemptTextQuestion v-if="question.type === QuestionType.Text" v-bind="bindTextQn(question)" />
      </div>
    </div>
  </div>
</template>
