<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import type { TRPCClientError } from '~/shared/types'

const props = defineProps<{
  groupId: string
  forumId: string
}>()

const route = useRoute()
const { visible } = useSidebar()
const toast = useToast()

const Dialog = defineAsyncComponent(() => import('primevue/dialog'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))
const Textarea = defineAsyncComponent(() => import('primevue/textarea'))

const formData = reactive({
  visible: false,
  title: '',
  content: '',
})

const { mutate: createMutate } = useCreateForumPostMutation(route.params.forumId as string)

const { data: group, isLoading: groupIsLoading } = useGroup(props.groupId)
const { data: forum, isLoading: forumIsLoading } = useForum(props.forumId)

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
      formData.content = ''
    },
  })
}
</script>

<template>
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
        <Textarea
          id="content" v-model="formData.content" :rows="5" :pt="{
            root: {
              class: 'bg-transparent border-none! outline-none! shadow-none! border-none! p0! py-0.75rem',
            },
          }" :required="true" placeholder="Add some content..." aria-describedby="content-help"
        />
        <small id="content-help" class="sr-only">Enter the content for the post</small>
      </div>

      <div mt6>
        <Button type="submit" size="small" label="Create" />
      </div>
    </form>
  </Dialog>

  <header class="header flex items-center border-b-1 border-b-$surface-border border-b-solid px6 py4">
    <div md:hidden>
      <Button text size="small" :pt="{ root: { style: 'padding: 0 !important' } }" @click="visible = !visible">
        <div v-if="visible" class="text-xl" i-tabler-layout-sidebar-left-collapse />
        <div v-else class="text-xl" i-tabler-layout-sidebar-left-expand />
      </Button>
    </div>

    <Skeleton v-if="groupIsLoading || forumIsLoading" height="20px" width="30%" />
    <Transition v-else-if="group && forum" appear>
      <span flex="~ gap3 items-center">
        <NuxtLink to="../..">
          <strong>
            {{ group.name }}
          </strong>
        </NuxtLink>
        <span>
          /
        </span>
        <span>
          Forums
        </span>
        <span>
          /
        </span>
        <span font-semibold>
          # {{ forum.name }}
        </span>
        <small>
          {{ forum.description }}
        </small>
      </span>
    </Transition>

    <div flex flex-1 items-center gap3>
      <Button :pt="{ root: { style: 'padding: 6px !important' } }" size="small" outlined type="button" label="New post" @click="formData.visible = true" />
    </div>
  </header>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
