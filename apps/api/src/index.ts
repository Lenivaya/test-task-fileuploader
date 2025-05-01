import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { env } from './env'
import { appRouter } from '@file-uploader/trpc'
import { kafkaService } from '@file-uploader/trpc'
import { startS3SyncJob } from '@file-uploader/trpc'
import { logger } from '@file-uploader/trpc'

async function main() {
  const server = fastify({
    maxParamLength: 5000,
    bodyLimit: 10 * 1024 * 1024
  })

  await server.register(cors, {
    origin: true,
    credentials: true
  })

  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: () => ({})
    }
  })

  await kafkaService.initialize()
  logger.info('Kafka service initialized successfully')

  startS3SyncJob(30)
  logger.info({ intervalMinutes: 30 }, 'S3 sync job scheduled')

  server.get('/health', async () => {
    return { status: 'ok' }
  })

  const shutdown = async () => {
    try {
      logger.info('Server shutdown initiated')
      await kafkaService.disconnect()
      await server.close()
      logger.info('Server shutdown completed')
    } catch (err) {
      logger.error({ err }, 'Error during shutdown')
    } finally {
      process.exit(0)
    }
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  await server.listen({ port: env.PORT, host: env.HOST })
  logger.info({ address: `${env.HOST}:${env.PORT}` }, 'Server listening')
}

main()
  .catch((err) => {
    logger.fatal({ err }, 'Fatal error during server startup')
    process.exit(1)
  })
  .then(() => {
    logger.info('Server started ')
  })
