<script setup lang="ts">
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
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
const { mutate: updateDeadlineMutate } = useUpdateDeadlineMutation(props.groupId)

const upvotedByUser = computed(() => {
  return props.upvotes.some(upvote => upvote.id === me.value?.id)
})

const editState = ref({
  editing: false,
  name: '',
})

function toggleEdit() {
  editState.value = {
    editing: true,
    name: props.name,
  }
}

function upvote() {
  toggleVoteMutate({
    deadlineId: props.id,
  })
}

function edit() {
  updateDeadlineMutate({
    deadlineId: props.id,
    name: editState.value.name,
    dueDate: props.dueDate,
  }, {
    onSuccess() { // TODO need a better way to do this, currently this is a bit slow because of the query revalidation takes a while. This can be eager mutation.
      editState.value.editing = false
    },
  })
}
</script>

<template>
  <div flex items-center p3 space-x-4 class="border-$surface-border text-sm">
    <div flex flex-1>
      <form v-if="editState.editing" @submit.prevent="edit">
        <InputText v-model="editState.name" unstyled :pt="{ root: { class: 'bg-transparent outline-none' } }" />
      </form>
      <span v-else @click="toggleEdit">
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
