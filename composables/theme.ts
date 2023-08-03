export function useTheme() {
  const cookieRaw = useCookie('theme')
  return {
    cookieRaw,
  }
}
