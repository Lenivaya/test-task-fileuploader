import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import prisma from "../prisma";
import { env } from "../env";

// Initialize S3 client
const s3Client = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

/**
 * Sync S3 files with database
 * This job checks if files in S3 exist in the database
 * If not, it deletes them from S3
 */
export async function syncS3Files(): Promise<void> {
  console.log("Starting S3 file synchronization job");

  try {
    // Get all files from S3
    const s3Files = await listAllS3Objects(env.S3_BUCKET_NAME);
    console.log(`Found ${s3Files.length} files in S3`);

    // Get all S3 keys from database
    const dbFiles = await prisma.file.findMany({
      select: { s3Key: true },
    });
    const dbKeys = new Set(dbFiles.map((file) => file.s3Key));
    console.log(`Found ${dbKeys.size} files in database`);

    // Find files that exist in S3 but not in the database
    const orphanedFiles = s3Files.filter((key) => !dbKeys.has(key));
    console.log(`Found ${orphanedFiles.length} orphaned files in S3`);

    // Delete orphaned files from S3
    if (orphanedFiles.length > 0) {
      for (const key of orphanedFiles) {
        console.log(`Deleting orphaned file: ${key}`);
        await deleteS3Object(env.S3_BUCKET_NAME, key);
      }
      console.log(`Deleted ${orphanedFiles.length} orphaned files from S3`);
    } else {
      console.log("No orphaned files found");
    }

    console.log("S3 file synchronization completed successfully");
  } catch (error) {
    console.error("Error during S3 file synchronization:", error);
  }
}

/**
 * List all objects in an S3 bucket
 */
async function listAllS3Objects(bucket: string): Promise<string[]> {
  const objects: string[] = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);

    if (response.Contents) {
      for (const object of response.Contents) {
        if (object.Key) {
          objects.push(object.Key);
        }
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return objects;
}

/**
 * Delete an object from S3
 */
async function deleteS3Object(bucket: string, key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3Client.send(command);
}
