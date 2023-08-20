import type { HttpLogger } from 'pino-http'
import pinoHttp from 'pino-http'
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
      httpLogger = pinoHttp({
        transport: {
          target: 'pino-pretty',
        },
      })
    }
    else {
      const config = useRuntimeConfig()
      httpLogger = pinoHttp({
        transport: {
          target: '@axiomhq/pino',
          options: {
            dataset: config.axiom.dataset,
            token: config.axiom.token,
          },
        },
      })
    }
  }

  httpLogger(event.node.req, event.node.res)

  event.context.logger = httpLogger.logger
})
