import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../env'
import { logger } from '../logger'

// Initialize S3 client
export const s3Client = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY
  }
})

/**
 * Upload a file to S3
 */
export async function uploadFileToS3(
  key: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  logger.debug({ key, size: file.length, contentType }, 'Uploading file to S3')

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType
  })

  await s3Client.send(command)

  // Generate a public URL for the file
  const fileUrl = `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${key}`
  logger.debug({ key, url: fileUrl }, 'File uploaded to S3 successfully')

  return fileUrl
}

/**
 * Delete a file from S3
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  logger.debug({ key }, 'Deleting file from S3')

  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key
  })

  await s3Client.send(command)
  logger.debug({ key }, 'File deleted from S3 successfully')
}

/**
 * Generate a pre-signed URL for file upload
 * Used for direct browser uploads
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  logger.debug(
    { key, contentType, expiresIn },
    'Generating presigned upload URL'
  )

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType
  })

  const url = await getSignedUrl(s3Client, command, { expiresIn })
  logger.debug({ key }, 'Generated presigned upload URL')

  return url
}
