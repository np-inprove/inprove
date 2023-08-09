<script setup lang="ts">
import Button from 'primevue/button'
import ScrollPanel from 'primevue/scrollpanel'

const route = useRoute()
const router = useRouter()
const { mutate, isLoading } = useDeleteGroupMutation(route.params.groupId as string)

function deleteGroup() {
  mutate(undefined, {
    onSuccess() {
      router.replace('/dashboard')
    },
  })
}
</script>

<template>
  <div class="pr0!" overflow-x-hidden overflow-y-auto p4 md:p8>
    <div h-full>
      <ScrollPanel style="height: 100%" class="pr6">
        <div>
          <h2 class="mb-2">
            Settings
          </h2>
          <Button severity="danger" label="Delete" :disabled="isLoading" @click="deleteGroup" />
        </div>
      </ScrollPanel>
    </div>
  </div>
</template>
