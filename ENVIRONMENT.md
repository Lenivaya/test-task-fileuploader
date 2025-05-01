# Environment Configuration

This document outlines the environment variables required to run the File Management Platform.

## Required Environment Variables

Create a `.env` file in the `apps/api` directory of the project with the following variables:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/filemanagement

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=uploads

# Kafka
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=file-uploader

# Server
HOST=0.0.0.0
PORT=3001
```

## Variable Explanations

### Database Configuration

- `DATABASE_URL`: Connection string for PostgreSQL database.

### S3/MinIO Configuration

- `S3_ENDPOINT`: URL of the S3-compatible storage service (MinIO in our case).
- `S3_REGION`: Region of the S3 storage (can be any valid region).
- `S3_ACCESS_KEY`: Access key for S3 authentication.
- `S3_SECRET_KEY`: Secret key for S3 authentication.
- `S3_BUCKET_NAME`: Name of the bucket for file storage.

### Kafka Configuration

- `KAFKA_BROKERS`: Comma-separated list of Kafka broker addresses.
- `KAFKA_CLIENT_ID`: Client ID used to identify the application to Kafka.

### Server Configuration

- `HOST`: Host address for the backend API server.
- `PORT`: Port number for the backend API server.

## Docker Infrastructure Configuration

The environment variables for the infrastructure services (PostgreSQL, MinIO, Kafka) are configured in the `docker-compose.yml` file. You generally don't need to modify these unless you have specific requirements or port conflicts.

## Development vs Production

For production environments, you should:

1. Use a secure database connection string with proper credentials.
2. Set up a production-ready S3 service with proper authentication.
3. Configure a production Kafka cluster with security settings.
4. Set appropriate host and port configurations.

Always ensure that production credentials are kept secure and never committed to version control.
