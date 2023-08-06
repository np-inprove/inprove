<script setup lang="ts">
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Skeleton from 'primevue/skeleton'

const route = useRoute()

const { data: post, isLoading: postIsLoading, error: postError } = useForumPost(route.params.forumId as string, route.params.postId as string)

const { mutate: createMutate } = useCreateForumPostMutation(route.params.forumId as string, route.params.postId as string)

const formData = reactive({
  content: '',
})

function comment() {
  createMutate({
    title: '',
    content: formData.content,
  })
}
</script>

<template>
  <div p4 md:p8>
    <div v-if="postIsLoading" space-y-4>
      <Skeleton height="20px" />
      <Skeleton height="40px" />
      <Skeleton height="100px" />
    </div>

    <LazyErrorCard v-else-if="postError" v-bind="postError" />

    <div v-else-if="post">
      <h2 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        {{ post.title }}
      </h2>

      <p class="leading-7 [&:not(:first-child)]:mt-3">
        {{ post.content }}
      </p>

      <div mt4>
        <ForumPostReactionPanel
          :post-id="post.id"
          :forum-id="
            route.params.forumId as string
          "
        />
      </div>

      <div mt8 space-y-4>
        <form @submit.prevent="comment">
          <div flex flex-col gap-4>
            <label for="comment">Leave a comment</label>
            <Textarea id="comment" v-model="formData.content" class="w-full" placeholder="What are your thoughts?" />
            <div self-end>
              <Button class="ml-auto" size="small" type="submit" label="Comment" />
            </div>
          </div>
        </form>

        <ForumPostComments
          :forum-id="
            route.params.forumId as string
          "
          :post-id="
            route.params.postId as string
          "
        />
      </div>
    </div>
  </div>
</template>
