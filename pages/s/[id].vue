<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Skeleton from 'primevue/skeleton'
import { useQuery } from '@tanstack/vue-query'

const { $client } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const { data: me } = useQuery({
  queryKey: ['me'],
  queryFn: () => $client.me.get.query(),
})

const { mutate, isLoading } = useAcceptInstitutionInviteMutation()

const { data: invite, isLoading: inviteIsLoading, error: inviteError } = useQuery({
  queryKey: ['institutions', route.params.id],
  queryFn: () => $client.institutionInvite.get.query({ inviteId: route.params.id as string }),
  retry: false,
})

function createAccount() {
  router.push({
    path: '/login',
    query: {
      redirectTo: route.fullPath,
    },
  })
}

function join() {
  mutate(
    {
      inviteId: route.params.id as string,
    },
    {
      onSuccess() {
        router.push('/dashboard')
      },
    },
  )
}
</script>

<template>
  <div class="h-full flex flex-col">
    <DashboardHeader :name="me?.name" :admin="me?.admin" />

    <div mb-20 h-full flex items-center justify-center px3 lg:mb30>
      <Skeleton v-if="inviteIsLoading" width="300px" height="200px" />
      <LazyErrorCard v-else-if="inviteError" v-bind="inviteError" />
      <Card v-else-if="invite?.institution.id === me?.institution?.id" class="min-w-md">
        <template #title>
          {{ invite?.institution.name }}
        </template>
        <template #subtitle>
          You're already in {{ invite?.institution.name }}!
        </template>
        <template #content>
          <Button size="small" label="Go to dashboard" @click="$router.push('/dashboard')" />
        </template>
      </Card>
      <Card v-else class="min-w-md">
        <template #title>
          {{ invite?.institution.name }}
        </template>
        <template #subtitle>
          You're invited to join {{ invite?.institution.name }}! Use an existing account, or create a new one.
        </template>
        <template #content>
          <div v-if="!me">
            <Button size="small" :loading="isLoading" label="Create an account" @click="createAccount" />
          </div>
          <div v-else flex flex-col gap4>
            <span v-if="me.institutionRole">You will lose your privileges as {{ me.institutionRole }} in {{
              me.institution?.name }}</span>
            <Button size="small" :loading="isLoading" :label="`Join ${invite?.institution.name}`" @click="join" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
