import pino from 'pino'
import { env } from './env'

const logger = pino({
  level: env.LOG_LEVEL || 'info',
  serializers: {
    ...pino.stdSerializers
  },
  base: {
    app: 'api',
    env: process.env.NODE_ENV || 'development'
  },
  ...(env.NODE_ENV === 'production'
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
          }
        }
      })
})

export { logger }
