<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import { useQuery } from '@tanstack/vue-query'

const { $client } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const inviteId = route.params.id as string

const { data: me } = useQuery({
  queryKey: ['me'],
  queryFn: () => $client.me.get.query(),
})

const { data: invite, isLoading: inviteIsLoading, error: inviteError } = useQuery({
  queryKey: [inviteId],
  queryFn: () => $client.group.invites.get.query({ inviteId }),
  retry: false,
})

const { mutate, isLoading } = useAcceptGroupInviteLinkMutation()

function joinGroup() {
  mutate(
    {
      inviteId,
    },
    {
      onSuccess() {
        router.push(`/dashboard/${invite.value?.group.id}`)
      },
    },
  )
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div mb-20 h-full flex items-center justify-center px3 lg:mb30>
      <Skeleton v-if="inviteIsLoading" width="400px" height="150px" />
      <LazyErrorCard v-else-if="inviteError" v-bind="inviteError" />
      <!-- <Card v-else-if="userInGroup" class="min-w-md">
      <template #title>
        <h1>{{ invite?.group.name }}</h1>
        <Tag severity="info" :value="invite?.role" />
      </template>
      <template #subtitle>
        You're already in {{ invite?.group.name }}!
      </template>
      <template #content>
        <Button size="small" label="Go to group" @click="$router.push('/dashboard/group')" />
      </template>
      </Card> -->
      <Card v-else class="min-w-md">
        <template #title>
          <h1>{{ invite?.group.name }}</h1>
          <Tag severity="info" :value="invite?.role" />
        </template>
        <template #subtitle>
          You're invited to join {{ invite?.group.name }}! Use an existing account, or create a new one.
        </template>
        <template #footer>
          <Button size="small" class="w-full" label="Join group" :loading="isLoading" @click="joinGroup" />
        </template>
      </Card>
    </div>
  </div>
</template>
