import pino from "pino";
import { env } from "./env";

// Configure logger based on environment
const logger = pino({
  level: env.LOG_LEVEL || "info",
  // Add standard serializers for common objects like errors
  serializers: {
    ...pino.stdSerializers,
    // Add any custom serializers here
  },
  // Add common base properties to all logs
  base: {
    app: "api",
    env: process.env.NODE_ENV || "development",
  },
  // Use different transports based on environment
  ...(env.NODE_ENV === "production"
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }),
});

export { logger };
