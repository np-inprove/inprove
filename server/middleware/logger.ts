import type { HttpLogger } from 'pino-http'
import pinoHttp from 'pino-http'

let httpLogger: HttpLogger

declare module 'h3' {
  interface H3EventContext {
    logger: HttpLogger['logger']
  }
}

export default defineEventHandler(async (event) => {
  if (!httpLogger) {
    httpLogger = pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    })
  }

  httpLogger(event.node.req, event.node.res)

  event.context.logger = httpLogger.logger
})
