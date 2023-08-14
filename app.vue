<script setup lang="ts">
const config = useRuntimeConfig()

const { cookieRaw } = useTheme()
const route = useRoute()
const resolvedTheme = computed(() => {
  let theme = 'mdc-dark-indigo'
  if (route.query.theme)
    theme = cookieRaw.value = route.query.theme as string

  if (cookieRaw.value)
    theme = cookieRaw.value

  else
    cookieRaw.value = theme

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
