# File Management Platform

A mini-platform for managing files, built with a modern stack:

- Backend: Fastify + tRPC + Prisma
- Storage: PostgreSQL + MinIO (S3-compatible)
- Messaging: Kafka
- Frontend: Next.js + React + Tailwind

## Features

- Upload files to S3-compatible storage with a modern UI
- Multiple file upload support with progress tracking
- List and manage files stored in the database
- Delete files (removes from both database and S3)
- Kafka events publishing for file uploads
- Background job to ensure S3 and database sync

## Project Structure

This is a monorepo built with Turborepo and pnpm, containing:

- `/apps/api`: Backend API service with Fastify, tRPC, and Prisma
- `/apps/web`: Frontend web application with Next.js, React, and Tailwind CSS
- `/packages/schema`: Shared schemas and types using Zod
- `/packages/trpc`: tRPC routers and procedures
- `/packages/ui`: Shared UI components
- `/packages/eslint-config`: Shared ESLint configuration
- `/packages/tailwind-config`: Shared Tailwind configuration
- `/packages/typescript-config`: Shared TypeScript configuration

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
docker compose up -d
```

4. Create a `.env` file in the `apps/api` directory (see [ENVIRONMENT.md](ENVIRONMENT.md) for details)

5. Generate Prisma client (if changed models, in other cases may be omitted):

```bash
cd apps/api
pnpm prisma generate
pnpm prisma db push
```

6. Start the development server:

```bash
pnpm dev
```

This will start both the backend API and the frontend web application in development mode.

## API Endpoints

The API is exposed through tRPC and includes:

- `file.getFiles`: Get all files
- `file.uploadFile`: Upload a single file
- `file.deleteFile`: Delete a file
- `files.uploadFiles`: Upload multiple files

## Development

The application uses Turbopack for fast development. To start the development servers:

```bash
pnpm dev
```

This will run the backend API on port 3001 and the frontend web application on port 3000.

## Infrastructure

The project relies on several infrastructure components:

- **PostgreSQL**: Database for storing file metadata
- **MinIO**: S3-compatible object storage for file content
- **Kafka**: Message broker for event-driven architecture
- **Zookeeper**: Required by Kafka for coordination
- **Kafka UI**: Web interface for monitoring Kafka events

All infrastructure components are configured in the `docker-compose.yml` file and can be started with `docker compose up -d`.
