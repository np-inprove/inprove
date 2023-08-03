// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  experimental: {
    componentIslands: true,
  },

  vue: {
    defineModel: true,
  },

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/html-validator',
    '@nuxt/image',
  ],

  typescript: {
    strict: true,
  },

  build: {
    transpile: [
      'primevue',
      'trpc-nuxt',
    ],
  },

  css: [
    '@unocss/reset/tailwind-compat.css',
    '~/styles/global.css',
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width,height=device-height,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no,viewport-fit=cover',
      htmlAttrs: { lang: 'en' },
    },
  },

  htmlValidator: {
    logLevel: 'error',
    failOnError: true,
    options: {
      rules: {
        'wcag/h37': 'warn',
        'element-permitted-content': 'warn',
        'element-required-attributes': 'warn',
        'attribute-empty-style': 'off',
      },
    },
  },

  image: {},

  runtimeConfig: {
    public: {
      appName: 'iNProve',
    },

    skipEnvValidation: false,
    databaseUrl: '',
    otpExpiry: 600,

    sessionSecret: '',
    sessionName: 'h3',

    admins: '',

    axiom: {
      dataset: '',
      token: '',
    },

    redis: {
      enabled: false,
      host: '',
      port: 0,
      username: '',
      password: '',
    },

    resend: {
      apiKey: '',
      fromAddress: '',
    },
  },
})
