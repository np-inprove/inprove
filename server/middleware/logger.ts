import type { HttpLogger } from 'pino-http'
import pinoHttp from 'pino-http'
import axiomPino from '@axiomhq/pino'
import { isDevelopment } from 'std-env'

let httpLogger: HttpLogger

declare module 'h3' {
  interface H3EventContext {
    logger: HttpLogger['logger']
  }
}

export default defineEventHandler(async (event) => {
  if (!httpLogger) {
    if (isDevelopment) {
      httpLogger = pinoHttp()
    }
    else {
      httpLogger = pinoHttp(await axiomPino({
        dataset: useRuntimeConfig().axiom.dataset,
        token: useRuntimeConfig().axiom.token,
      }))
    }
  }

  httpLogger(event.node.req, event.node.res)

  event.context.logger = httpLogger.logger
})
