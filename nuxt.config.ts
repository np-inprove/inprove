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
    'nuxt-security',
  ],

  typescript: {
    strict: true,
  },

  build: {
    transpile: [
      'primevue',
      'trpc-nuxt',
      'tslib', // Used by rrule
      'rrule',
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

  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
    },
    rateLimiter: {
      tokensPerInterval: 10,
      interval: 'minute',
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

    r2: {
      accountId: '',
      secretAccessKey: '',
      accessKeyId: '',
      bucketName: 'inprove',
      folderNames: {
        forum: 'forum',
      },
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
