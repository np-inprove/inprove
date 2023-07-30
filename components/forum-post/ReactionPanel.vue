<script setup lang="ts">
import Button from 'primevue/button'
import OverlayPanel from 'primevue/overlaypanel'

const props = defineProps<{
  postId: string
  forumId: string
}>()

// This list is ChatGPT generated
const allowedEmojis = [
  '👍',
  '👎',
  '😂',
  '😮',
  '😢',
  '😡',
  '👏',
  '👌',
  '🎉',
  '🔥',
  '🚀',
  '👀',
  '💯',
  '🤔',
  '🙌',
  '💩',
  '👻',
  '💕',
  '👑',
  '🍻',
  '🚨',
  '👇',
  '👈',
  '👉',
  '👆',
  '🙏',
  '🤦',
  '🤷',
  '🤯',
  '🤬',
  '🤢',
  '🤮',
  '👋',
  '🤝',
  '👊',
  '✊',
  '🤘',
  '👏',
]

const op = ref()
const { data: post } = useForumPost(props.forumId, props.postId)
const { mutate } = useReactForumPostMutation(props.forumId, props.postId)

function toggle(event: any) {
  op.value?.toggle(event)
}

function react(emoji: string) {
  mutate({ emoji })
}
</script>

<template>
  <!-- Loading and error state is handled by page component -->
  <div v-if="post" flex space-x-1>
    <div>
      <Button size="small" icon="" rounded class="h-8!" @click="toggle">
        <div i-tabler-mood-plus />
      </Button>
    </div>

    <OverlayPanel ref="op" :pt="{ content: { class: 'p2!' } }">
      <div grid="~ cols-6">
        <Button
          v-for="emoji in allowedEmojis" :key="emoji" unstyled
          :pt="{ root: { class: 'bg-white hover:bg-$surface-hover rounded-md' } }" @click="react(emoji)"
        >
          {{ emoji }}
        </Button>
      </div>
    </OverlayPanel>

    <div
      v-for="{ _count, emoji } in post?.reactionsAggregate"
      :key="emoji"
    >
      <Button
        v-if="emoji === post?.currentReaction?.emoji"
        class="h-8! bg-$highlight-bg!" outlined size="small" icon="" rounded
      >
        {{ _count.emoji }} {{ emoji }}
      </Button>
      <Button
        v-else
        class="h-8!" outlined size="small" icon="" rounded
        @click="react(emoji)"
      >
        {{ _count.emoji }} {{ emoji }}
      </Button>
    </div>
  </div>
</template>
