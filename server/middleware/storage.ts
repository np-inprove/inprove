import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

declare module 'h3' {
  interface H3EventContext {
    storage: {
      client: S3Client
      generateSignedPutUrl(params: PutObjectCommandInput): Promise<string>
    }
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

  function generateSignedPutUrl(params: PutObjectCommandInput) {
    return getSignedUrl(storage, new PutObjectCommand(params), {
      expiresIn: 60 * 5, // 5 minutes
    })
  }

  event.context.storage = {
    client: storage,
    generateSignedPutUrl,
  }
})
