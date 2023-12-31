// @unocss-include

import PrimeVue from 'primevue/config'
import type { CardPassThroughOptions } from 'primevue/card'

const clickableCard: CardPassThroughOptions = {
  root: {
    class: 'rounded-lg! hover:bg-$highlight-bg transition duration-150',
  },
  content: {
    class: 'py2!',
  },
}

export default defineNuxtPlugin({
  parallel: true,
  async setup(nuxtApp) {
    nuxtApp.vueApp.use(PrimeVue, {
      ripple: false,
      pt: {
        button: {
          root: {
            class: 'py2! px3! min-w-unset',
          },
          label: {
            class: 'font-semibold!',
          },
        },
      },
    })

    const [{ default: ToastService }, { default: ConfirmationService }] = await Promise.all([
      import('primevue/toastservice'),
      import('primevue/confirmationservice'),
    ])

    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.use(ConfirmationService)

    return {
      provide: {
        pt: {
          clickableCard,
        },
      },
    }
  },
})
