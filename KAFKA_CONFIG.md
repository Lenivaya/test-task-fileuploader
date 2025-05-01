# Kafka Configuration Guide

## Environment Setup

The application uses Kafka for event streaming. Depending on your runtime environment, you'll need to configure the Kafka broker address appropriately.

### Environment Variables

In your `.env` files (in both `packages/trpc/.env` and `apps/api/.env`), set the following:

```
# Kafka
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=file-uploader
```

### Configuration Scenarios

1. **Local Development (outside Docker)**

   - When running your application locally but Kafka is in Docker
   - Use: `KAFKA_BROKERS=localhost:29092`
   - This connects to the Kafka instance via the host machine's port mapping

2. **Running inside Docker**

   - When your application is also running in the same Docker network as Kafka
   - Use: `KAFKA_BROKERS=kafka:9092`
   - This uses the internal Docker network name

3. **Production Deployment**
   - When running in production with your actual Kafka broker address
   - Use: `KAFKA_BROKERS=your-kafka-broker.example.com:9092`
   - You can also specify multiple brokers: `broker1:9092,broker2:9092`

## Docker Compose Configuration

The docker-compose.yml file is set up with Kafka exposing two listeners:

- `PLAINTEXT://kafka:9092` - For internal Docker network communication
- `PLAINTEXT_HOST://localhost:29092` - For external access from the host

This dual setup allows services both inside and outside the Docker network to connect to Kafka.

## Troubleshooting

If you encounter connection errors:

1. **"getaddrinfo ENOTFOUND kafka"**

   - This means your app is trying to reach "kafka" hostname but it's not resolvable
   - Solution: Use `localhost:29092` instead if running outside Docker

2. **"Connection timeout"**
   - Check if Kafka is actually running and port 29092 is accessible
   - Test with: `nc -zv localhost 29092`
