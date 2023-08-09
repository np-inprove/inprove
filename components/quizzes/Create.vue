<script setup lang="ts">
// Visible on first load, so no dynamic import
import Button from 'primevue/button'

const props = defineProps<{
  groupId: string
}>()

const Dialog = defineAsyncComponent(() => import('primevue/dialog'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))
const Textarea = defineAsyncComponent(() => import('primevue/textarea'))

const formData = reactive({
  visible: false,
  name: '',
  description: '',
})

const { mutate: createQuizMutate } = useCreateQuizMutation(props.groupId)

function createQuiz() {
  createQuizMutate({
    name: formData.name,
    description: formData.description,
  }, {
    onSuccess() {
      formData.visible = false
      formData.name = ''
      formData.description = ''
    },
  })
}
</script>

<template>
  <Button size="small" icon="true" icon-pos="right" label="Create Quiz" :pt="{ icon: { class: 'i-tabler-plus' } }" @click="formData.visible = true" />
  <Dialog v-model:visible="formData.visible" modal header="New quiz" class="min-w-sm">
    <form space-y-4 @submit.prevent="createQuiz">
      <div class="flex flex-col gap-2">
        <label for="name">Name</label>
        <InputText
          id="name" v-model="formData.name" autofocus :required="true" placeholder="Learning X."
          aria-describedby="name-help"
        />
        <small id="name-help" class="sr-only">Enter the name of the quiz</small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="description">Description</label>
        <Textarea
          id="description" v-model="formData.description" placeholder="In this check-in, you will learn how to X."
          aria-describedby="description-help"
        />
        <small id="description-help" class="sr-only">Enter the description of the quiz</small>
      </div>

      <div mt6>
        <Button type="submit" size="small" label="Create" />
      </div>
    </form>
  </Dialog>
</template>
