import { FastifyRequest } from "fastify";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../env";
import { Readable } from "stream";

// Initialize S3 client
const s3Client = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

// Track upload progress for each file
const uploadProgress = new Map<string, { total: number; loaded: number }>();

/**
 * Upload a file to S3 with progress tracking
 */
export async function uploadFileWithProgress(
  fileId: string,
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  // Create a readable stream from the buffer
  const readable = Readable.from(buffer);

  // Setup progress tracking
  const total = buffer.length;
  uploadProgress.set(fileId, { total, loaded: 0 });

  // Upload file with custom upload progress handler
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  // Add upload progress listener
  command.middlewareStack.add(
    (next) => async (args) => {
      if (args.request.body instanceof Readable) {
        const stream = args.request.body;

        let loaded = 0;
        stream.on("data", (chunk) => {
          loaded += chunk.length;
          const progress = uploadProgress.get(fileId);
          if (progress) {
            progress.loaded = loaded;
            uploadProgress.set(fileId, { ...progress });
          }
        });
      }

      return next(args);
    },
    { step: "build" }
  );

  await s3Client.send(command);

  // Generate a public URL for the file
  const fileUrl = `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${key}`;
  return fileUrl;
}

/**
 * Get upload progress for a file
 */
export function getUploadProgress(fileId: string): { progress: number } | null {
  const progress = uploadProgress.get(fileId);
  if (!progress) return null;

  const { total, loaded } = progress;
  return {
    progress: Math.min(Math.round((loaded / total) * 100), 100),
  };
}

/**
 * Clean up progress tracking for a file
 */
export function cleanupProgress(fileId: string): void {
  uploadProgress.delete(fileId);
}
