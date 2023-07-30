<script setup lang="ts">
/**
 * TODO Loading and error handling states, maybe a better layout
 */

import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Skeleton from 'primevue/skeleton'
import { useToast } from 'primevue/usetoast'

const Dialog = defineAsyncComponent(() => import('primevue/dialog'))
const InputText = defineAsyncComponent(() => import('primevue/inputtext'))
const Textarea = defineAsyncComponent(() => import('primevue/textarea'))

const toast = useToast()
const route = useRoute()
const formData = reactive({
  visible: false,
  title: '',
  content: '',
})

const { data: forum, isLoading: forumIsLoading, error: forumError } = useForum(route.params.forumId as string)
const { data: posts, isLoading: postsIsLoading, error: postsError } = useForumPosts(route.params.forumId as string)

const { mutate: createMutate } = useCreateForumPostMutation(route.params.forumId as string)

function createPost() {
  formData.visible = false
  createMutate(formData, {
    onError(err) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: err.message,
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
  <VeryRoundCard>
    <Skeleton v-if="forumIsLoading" />
    <LazyErrorCard v-else-if="forumError" v-bind="forumError" />
    <template v-else-if="forum">
      <Dialog v-model:visible="formData.visible" modal header="New institution" class="min-w-sm">
        <form @submit.prevent="createPost">
          <div class="flex flex-col gap-2">
            <label for="title">Title</label>
            <InputText
              id="title" v-model="formData.title" autofocus :required="true" placeholder="I know math!"
              aria-describedby="title-help"
            />
            <small id="title-help" class="sr-only">Enter the title for the post</small>
          </div>

          <div class="flex flex-col gap-2">
            <Textarea
              id="content" v-model="formData.content" :required="true" placeholder="Actually nevermind, I don't!"
              aria-describedby="content-help"
            />
            <small id="content-help" class="sr-only">Enter the content for the post</small>
          </div>

          <div mt6>
            <Button type="submit" size="small" label="Create" />
          </div>
        </form>
      </Dialog>

      <div flex items-center justify-between>
        <div>
          <h2 text-lg font-semibold>
            # {{ forum?.name }}
          </h2>
          <small>{{ forum.description }}</small>
        </div>
        <Button size="small" @click="formData.visible = true">
          Create post
        </Button>
      </div>

      <!-- For some reason, the divider does not appear -->
      <Divider :pt="{ root: { class: 'before:border-solid!' } }" />

      <!-- <ScrollPanel style="height: 100%">
        <div space-y-4>
          <DashboardForumPostCard
            v-for="post in posts" :key="post.id" :forum-id="route.params.forumId as string"
            :post-id="post.id" :title="post.title" :content="post.content" :author-name="post.author?.name ?? ''"
            :timestamp="post.timestamp"
          />
        </div>
      </ScrollPanel> -->
    </template>
  </VeryRoundCard>
</template>
