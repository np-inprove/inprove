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
const FileUpload = defineAsyncComponent(() => import('primevue/fileupload'))

const { mutate: createMutate } = useCreateForumPostMutation(props.forumId)
const { mutate: createPresignedMutate } = useUploadAttachment(props.forumId)

const formData = reactive<{
  visible: boolean
  title: string
  richContent: string
  files: { id: string; name: string }[]
}>({
  visible: false,
  title: '',
  richContent: '',
  files: [],
})

function createPost() {
  formData.visible = false
  createMutate({
    ...formData,
    attachments: formData.files.map(({ id }) => id),
  }, {
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

function uploader({ files }: { files: File | File[] }) {
  createPresignedMutate(Array.isArray(files) ? files : [files], {
    onSuccess(data, files) {
      data.forEach((file, idx) => {
        formData.files.push({
          id: file.id,
          name: files[idx].name,
        })
      })
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
          }" :required="true" placeholder="Post title" aria-describedby="title-help" autofocus unstyled
        />
        <small id="title-help" class="sr-only">Enter the title for the post</small>
      </div>

      <div class="flex flex-col gap-2">
        <ForumTiptapEditor v-model="formData.richContent" placeholder="Some content here!" />
        <FileUpload mode="basic" name="files[]" accept="image/*" :max-file-size="1000000" choose-label="Add attachment" auto custom-upload multiple @uploader="uploader" />

        <Button v-for="file in formData.files" :key="file.id" size="small" :label="file.name" class="mt-2" />
      </div>

      <div mt6>
        <Button type="submit" size="small" label="Create" />
      </div>
    </form>
  </Dialog>
</template>
