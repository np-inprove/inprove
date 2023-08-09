export default defineNuxtComponent({
  setup(props, { slots, attrs }) {
    const { $cn } = useNuxtApp()
    return () => (
      <div
        {...props}
        {...attrs}
        class={$cn('flex flex-col p-6 space-y-1.5', attrs.class as string)}
      >
        {slots.default && slots.default()}
      </div>
    )
  },
})
