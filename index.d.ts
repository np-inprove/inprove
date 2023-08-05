declare module 'nuxt/schema' {
  interface AppConfig {
    forum: {
      reactions: string[]
      redeemableReaction: string
    },

    points: {
      userMax: number
    },
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
