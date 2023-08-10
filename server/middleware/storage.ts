import {
  S3Client,
} from '@aws-sdk/client-s3'

declare module 'h3' {
  interface H3EventContext {
    storage: S3Client
  }
}

let storage: S3Client

export default defineEventHandler((event) => {
  if (!storage) {
    storage = new S3Client({
      region: 'auto',
      endpoint: `https://${useRuntimeConfig().r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: useRuntimeConfig().r2.accessKeyId || '',
        secretAccessKey: useRuntimeConfig().r2.secretAccessKey || '',
      },
    })
  }

  event.context.storage = storage
})
