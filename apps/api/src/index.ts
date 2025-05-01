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
  // Create Fastify server
  const server = fastify({
    maxParamLength: 5000
  })

  // Register CORS
  await server.register(cors, {
    origin: true, // Allow all origins in development
    credentials: true // Allow credentials
  })

  // Register tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: () => ({})
    }
  })

  // Initialize Kafka
  await kafkaService.initialize()
  logger.info('Kafka service initialized successfully')

  // Start S3 sync job (runs every 30 minutes)
  startS3SyncJob(30)
  logger.info({ intervalMinutes: 30 }, 'S3 sync job scheduled')

  // Health check endpoint
  server.get('/health', async () => {
    return { status: 'ok' }
  })

  // Handle shutdown
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

  // Start server
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
