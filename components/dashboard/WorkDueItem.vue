<script setup lang="ts">
import Button from 'primevue/button'
import formatRelative from 'date-fns/formatRelative/index'

const props = defineProps<{
  id: string
  groupId: string
  name: string
  dueDate: Date | null
  authorName: string
  upvotes: {
    id: string
  }[]
}>()

const { data: me } = useQuery(queries.me.info)
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

    <small v-if="props.dueDate" class="text-$text-color-secondary">
      Due {{ formatRelative(props.dueDate, new Date) }}
    </small>

    <Button
      unstyled
      size="small"
      :pt="{
        root: { class: 'bg-transparent flex' },
      }"
      @click="upvote"
    >
      <div
        :class="{
          'text-$primary-color': upvotedByUser,
        }"
        i-tabler-chevron-up
      />
      <span
        :class="{
          'text-$primary-color': upvotedByUser,
        }"
      >{{ props.upvotes.length }}</span>
    </Button>
  </div>
</template>
