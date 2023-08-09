<script setup lang="ts">
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import type { TRPCClientError } from '~/shared/types'

const props = defineProps<{
  forumId: string
}>()

const toast = useToast()

const Dialog = defineAsyncComponent(() => import('primevue/dialog'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))
const Textarea = defineAsyncComponent(() => import('primevue/textarea'))

const { mutate: createMutate } = useCreateForumPostMutation(props.forumId)

const formData = reactive({
  visible: false,
  title: '',
  richContent: '',
})

function createPost() {
  formData.visible = false
  createMutate(formData, {
    onError(err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: (err as TRPCClientError).message,
      })
    },
    onSettled() {
      formData.title = ''
      formData.richContent = ''
    },
  })
}
</script>

<template>
  <Button :pt="{ root: { style: 'padding: 6px !important' } }" size="small" outlined type="button" label="New post" @click="formData.visible = true" />

  <Dialog
    v-model:visible="formData.visible" modal header="New post" :pt="{
      headerTitle: {
        class: 'text-lg! opacity-80!',
      },
      header: {
        class: 'pb3!',
      },
    }" class="min-w-sm lg:min-w-lg md:min-w-md"
  >
    <form @submit.prevent="createPost">
      <div class="flex flex-col gap-2">
        <InputText
          id="title" v-model="formData.title" :pt="{
            root: {
              class: 'bg-transparent border-none! outline-none! shadow-none! border-none! py-0.75rem! font-semibold! text-xl',
            },
          }" :required="true" placeholder="Post title" aria-describedby="title-help" unstyled autofocus
        />
        <small id="title-help" class="sr-only">Enter the title for the post</small>
      </div>

      <div class="flex flex-col gap-2">
        <ForumTiptapEditor v-model="formData.richContent" placeholder="Some content here!" />
      </div>

      <div mt6>
        <Button type="submit" size="small" label="Create" />
      </div>
    </form>
  </Dialog>
</template>
