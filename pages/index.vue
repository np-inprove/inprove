<script setup lang="ts">
import Button from 'primevue/button'

const { $client } = useNuxtApp()
const config = useRuntimeConfig()

const { data: me } = await $client.me.get.useQuery(undefined, { lazy: true })
</script>

<template>
  <div>
    <header
      class="h-24 flex items-center justify-between bg-$surface-section p-6 lg:px-30"
    >
      <NuxtLink to="/">
        <span class="font-semibold">{{ config.public.appName }}</span>
      </NuxtLink>

      <Button v-if="me" label="Dashboard" @click="$router.push('dashboard')" />
      <Button v-else label="Login" @click="$router.push('login')" />
    </header>
    <main>
      <section
        class="grid grid-cols-1 bg-$surface-section p-6 pt-15 lg:grid-cols-2 lg:p-30"
      >
        <div>
          <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
            Experience the
            <br>
            future of learning
          </h1>
          <p class="mt-6 text-lg leading-8 opacity-60">
            Collaborate with classmates, collect rewards and plan your time.
          </p>

          <div flex="~ gap-2" mt6>
            <Button rounded label="Get started" @click="$router.push('/login')" />
          </div>
        </div>
        <div py-20>
          <UndrawDog mx-auto max-h-sm />
        </div>
      </section>
    </main>
  </div>
</template>
