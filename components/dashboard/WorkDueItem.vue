<script setup lang="ts">
import formatRelative from 'date-fns/formatRelative/index'

const props = defineProps<{
  id: string
  groupId: string
  name: string
  dueDate: Date
  authorName: string
  upvotes: {
    id: string
  }[]
}>()

const { data: me } = useMe()
const { mutate: toggleVoteMutate } = useToggleVoteDeadlineMutation(props.groupId)

const upvotedByUser = computed(() => {
  return props.upvotes.some(upvote => upvote.id === me.value?.id)
})

function upvote() {
  toggleVoteMutate({
    deadlineId: props.id,
  })
}
</script>

<template>
  <div flex items-center p3 space-x-4 class="border-$surface-border text-sm">
    <div flex flex-1>
      <span>
        {{ props.name }}
      </span>
    </div>

    <small class="text-$text-color-secondary">
      {{ formatRelative(props.dueDate, new Date) }}
    </small>

    <div
      as="button"
      flex
      :class="{
        'text-$primary-text': upvotedByUser,
      }"
      @click="upvote"
    >
      <div i-tabler-chevron-up />
      <span>{{ props.upvotes.length }}</span>
    </div>
  </div>
</template>
