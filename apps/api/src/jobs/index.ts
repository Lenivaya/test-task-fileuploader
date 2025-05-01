import { syncS3Files } from "./syncS3Files";
import { env } from "../env";
import { logger } from "../logger";

/**
 * Run the S3 sync job on a schedule
 * @param intervalMinutes - Interval in minutes
 */
export function startS3SyncJob(intervalMinutes = 60): void {
  logger.info({ intervalMinutes }, "Starting S3 sync job scheduler");

  // Run once immediately
  syncS3Files().catch((error) => {
    logger.error({ err: error }, "Error running S3 sync job");
  });

  // Then run on interval
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(() => {
    syncS3Files().catch((error) => {
      logger.error({ err: error }, "Error running S3 sync job");
    });
  }, intervalMs);
}
