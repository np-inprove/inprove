declare module 'nuxt/schema' {
  interface AppConfig {
    forum: {
      reactions: string[]
      redeemableReaction: string
    },

    points: {
      dailyAllowance: number
    },
  }
}

// It is always important to ensure you import/export something when augmenting a type
export { }
