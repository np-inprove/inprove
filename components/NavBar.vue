<script setup lang="ts">
import Button from 'primevue/button'

const { $client } = useNuxtApp()

// TODO temporary fix for bad redirect issue
const { data: me } = $client.me.get.useQuery()
</script>

<template>
  <header class="h-18 bg-$surface-section">
    <div class="mx-auto h-full flex items-center justify-between px-6 container">
      <NuxtLink to="/" aria-label="Homepage">
        <CommonAppLogo class="h-6" />
      </NuxtLink>

      <div flex grid="gap-2 md:gap-10">
        <Button link label="FAQs" @click="$router.push('/faqs')" />
        <Button link label="About Us" @click="$router.push('/about-us')" />

        <Button v-if="me" label="Dashboard" @click="$router.push('dashboard')" />
        <Button v-else label="Login" @click="$router.push('login')" />
      </div>
    </div>
  </header>
</template>
