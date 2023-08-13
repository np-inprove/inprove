import { type ClassValue } from 'clsx'

export default defineNuxtPlugin({
  parallel: true,
  async setup() {
    const { twMerge } = await import('tailwind-merge')
    const { clsx } = await import('clsx')

    function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }

    return {
      provide: {
        cn,
      },
    }
  },
})
