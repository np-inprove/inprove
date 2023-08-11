<script setup lang="ts">
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

const props = defineProps<{
  groupId: string
}>()

const { data, isLoading, error } = useQuizzes(props.groupId)
</script>

<template>
  <div>
    <div v-if="isLoading" space-y-4>
      <Skeleton v-for="_, idx in Array.from({ length: 10 })" :key="idx" height="50px" />
    </div>

    <div space-y-4>
      <Card v-for="quiz in data" :key="quiz.id">
        <CardHeader class="grid grid-cols-[1fr_115px] items-start gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle class="text-xl">
              {{ quiz.name }}
            </CardTitle>
            <CardDescription>{{ quiz.description }}</CardDescription>
          </div>
          <div className="flex items-center space-x-1 rounded-md">
            <NuxtLink prefetch :to="`/dashboard/${props.groupId}/quizzes/${quiz.id}/edit`">
              <Button outlined size="small">
                Edit
              </Button>
            </NuxtLink>
            <NuxtLink prefetch :to="`/dashboard/${props.groupId}/quizzes/${quiz.id}/attempt`">
              <Button size="small">
                Attempt
              </Button>
            </NuxtLink>
          </div>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>
