export default defineComponent({
  setup(props, { attrs, slots }) {
    const { $cn } = useNuxtApp()
    return () => (
      <h3 class={$cn('font-semibold leading-none tracking-tight', attrs.class as string)} {...props}>
        {slots.default && slots.default()}
      </h3>
    )
  },
})
