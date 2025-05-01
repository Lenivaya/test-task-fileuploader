import fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { env } from "./env";
import { appRouter } from "./server/routers";
import { kafkaService } from "./services/kafka";
import { startS3SyncJob } from "./jobs";

async function main() {
  // Create Fastify server
  const server = fastify({
    maxParamLength: 5000,
    logger: true,
  });

  // Register CORS
  await server.register(cors, {
    origin: true, // Allow all origins in development
  });

  // Register tRPC
  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: () => ({}),
    },
  });

  // Initialize Kafka
  await kafkaService.initialize();

  // Start S3 sync job (runs every 30 minutes)
  startS3SyncJob(30);

  // Health check endpoint
  server.get("/health", async () => {
    return { status: "ok" };
  });

  // Handle shutdown
  const shutdown = async () => {
    try {
      await kafkaService.disconnect();
      await server.close();
    } catch (err) {
      server.log.error("Error during shutdown:", err);
    } finally {
      process.exit(0);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Start server
  await server.listen({ port: env.PORT, host: env.HOST });
  console.log(`Server listening on ${env.HOST}:${env.PORT}`);
}

main()
  .catch((err) => {
    // If error during startup, log and exit
    // If server is not yet created, can't use server.log
    // eslint-disable-next-line no-console
    console.error("Fatal error during server startup:", err);
    process.exit(1);
  })
  .then(() => {
    // Optionally, you can log that main() finished, but server should keep running
  });
