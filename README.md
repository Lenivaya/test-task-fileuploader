# File Management Platform

A mini-platform for managing files, built with a modern stack:

- Backend: Fastify + tRPC + Prisma
- Storage: PostgreSQL + MinIO (S3-compatible)
- Messaging: Kafka
- Frontend: Next.js + React + Tailwind (to be implemented)

## Features

- Upload files to S3-compatible storage
- Multiple file upload support with progress tracking
- List files stored in the database
- Delete files (removes from both database and S3)
- Kafka events for file uploads
- Background job to ensure S3 and database sync

## Project Structure

This is a monorepo built with Turborepo and pnpm, containing:

- `/apps/api`: Backend API service
- `/apps/web`: Frontend web application (to be implemented)
- `/packages/schema`: Shared schemas and types
- `/packages/ui`: Shared UI components (to be implemented)

## Prerequisites

- Node.js (v18+)
- pnpm
- Docker and Docker Compose

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the infrastructure services:

```bash
docker-compose up -d
```

4. Create a `.env` file in the root directory:

```
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
```

5. Generate Prisma client:

```bash
cd apps/api
pnpm prisma generate
pnpm prisma db push
```

6. Start the development server:

```bash
pnpm dev
```

## API Endpoints

The API is exposed through tRPC and includes:

- `file.getFiles`: Get all files
- `file.uploadFile`: Upload a single file
- `file.deleteFile`: Delete a file
- `files.uploadFiles`: Upload multiple files
- `upload.getProgress`: Get upload progress

## Project Development

- **Backend**: Lives in `apps/api`, built with Fastify and tRPC
- **Frontend**: Will be in `apps/web` using Next.js and React
- **Shared Code**: Located in the `packages` directory
