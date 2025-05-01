import { Kafka, Producer } from "kafkajs";
import { env } from "../env";
import { File } from "@repo/schema";

// Initialize Kafka
const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS,
});

class KafkaService {
  private producer: Producer | null = null;

  async initialize(): Promise<void> {
    try {
      this.producer = kafka.producer();
      await this.producer.connect();
      console.log("Connected to Kafka");
    } catch (error) {
      console.error("Failed to connect to Kafka:", error);
      this.producer = null;
    }
  }

  async publishFileUploaded(file: File): Promise<void> {
    if (!this.producer) {
      console.warn("Kafka producer not initialized, skipping message");
      return;
    }

    try {
      await this.producer.send({
        topic: "file_uploaded",
        messages: [
          {
            key: file.id,
            value: JSON.stringify(file),
          },
        ],
      });
      console.log(`Published file_uploaded event for file ID: ${file.id}`);
    } catch (error) {
      console.error("Failed to publish Kafka message:", error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = null;
    }
  }
}

// Export a singleton instance
export const kafkaService = new KafkaService();
