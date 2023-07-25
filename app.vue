<script setup lang="ts">
const config = useRuntimeConfig()
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${config.public.appName} - ${titleChunk}` : config.public.appName
  },
})

const cookieRaw = useCookie('theme')
const route = useRoute()
const resolvedTheme = computed(() => {
  let theme = 'lara-dark-indigo'
  if (route.query.theme)
    theme = cookieRaw.value = route.query.theme as string

  if (cookieRaw.value)
    theme = cookieRaw.value

  return `/themes/${theme}/theme.css`
})
</script>

<template>
  <div class="h-full">
    <Head>
      <Link rel="stylesheet" :href="resolvedTheme" />
    </Head>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
