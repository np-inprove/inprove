// @unocss-include

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

export default defineNuxtPlugin({
  parallel: true,
  async setup(nuxtApp) {
    nuxtApp.vueApp.use(PrimeVue, {
      ripple: false,
      pt: {
        button: {
          root: {
            class: 'py2! px3!',
          },
          label: {
            class: 'font-semibold!',
          },
        },
      },
    })

    nuxtApp.vueApp.use(ToastService)
    nuxtApp.vueApp.use(ConfirmationService)
  },
})
