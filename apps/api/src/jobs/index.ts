import { syncS3Files } from "./syncS3Files";
import { env } from "../env";

/**
 * Run the S3 sync job on a schedule
 * @param intervalMinutes - Interval in minutes
 */
export function startS3SyncJob(intervalMinutes = 60): void {
  console.log(
    `Starting S3 sync job scheduler (runs every ${intervalMinutes} minutes)`
  );

  // Run once immediately
  syncS3Files().catch((error) => {
    console.error("Error running S3 sync job:", error);
  });

  // Then run on interval
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(() => {
    syncS3Files().catch((error) => {
      console.error("Error running S3 sync job:", error);
    });
  }, intervalMs);
}
