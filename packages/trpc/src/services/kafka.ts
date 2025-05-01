import { Kafka, Producer } from 'kafkajs'
import { env } from '../env'
import { File } from '@repo/schema'
import { logger } from '../logger'

// Initialize Kafka using environment configuration
// For local development, we use the Kafka broker exposed on localhost:29092
const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: ['localhost:29092'], // Explicitly using localhost:29092 instead of kafka:9092
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
})

class KafkaService {
  private producer: Producer | null = null

  async initialize(): Promise<void> {
    try {
      // Debug logging to see what environment values are being used
      logger.info(
        {
          envBrokers: env.KAFKA_BROKERS,
          actualBrokers: ['localhost:29092'],
          clientId: env.KAFKA_CLIENT_ID
        },
        'Kafka configuration'
      )

      this.producer = kafka.producer()
      await this.producer.connect()
      logger.info({ brokers: ['localhost:29092'] }, 'Connected to Kafka')
    } catch (error) {
      logger.error({ err: error }, 'Failed to connect to Kafka')
      this.producer = null
    }
  }

  async publishFileUploaded(file: File): Promise<void> {
    if (!this.producer) {
      logger.warn('Kafka producer not initialized, skipping message')
      return
    }

    try {
      await this.producer.send({
        topic: 'file_uploaded',
        messages: [
          {
            key: file.id,
            value: JSON.stringify(file)
          }
        ]
      })
      logger.info({ fileId: file.id }, 'Published file_uploaded event')
    } catch (error) {
      logger.error(
        { err: error, fileId: file.id },
        'Failed to publish Kafka message'
      )
    }
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect()
      logger.info('Disconnected from Kafka')
      this.producer = null
    }
  }
}

// Export a singleton instance
export const kafkaService = new KafkaService()
