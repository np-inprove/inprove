<script setup lang="ts">
const config = useRuntimeConfig()

const { cookieRaw } = useTheme()
const route = useRoute()
const resolvedTheme = computed(() => {
  let theme = 'lara-dark-indigo'
  if (route.query.theme)
    theme = cookieRaw.value = route.query.theme as string

  if (cookieRaw.value)
    theme = cookieRaw.value

  return `/themes/${theme}/theme.css`
})

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${config.public.appName} - ${titleChunk}` : config.public.appName
  },
  link: [
    {
      rel: 'stylesheet',
      href: resolvedTheme,
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.15s cubic-bezier(0.445, 0.05, 0.55, 0.95);
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.3rem);
}
</style>
