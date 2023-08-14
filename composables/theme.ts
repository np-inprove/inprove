export function useTheme() {
  const cookieRaw = useCookie('theme')
  const isDark = computed(() => cookieRaw.value?.includes('dark'))

  return {
    cookieRaw,
    isDark,
  }
}
