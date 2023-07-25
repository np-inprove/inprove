export const useSidebar = createGlobalState(() => {
  const visible = ref(false)
  return { visible }
})
