import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import prisma from '../prisma'
import { env } from '../env'
import { logger } from '../logger'
import { s3Client, deleteFileFromS3 } from '../services/s3'

/**
 * Sync S3 files with database.
 * Deletes S3 files that do not exist in the database.
 */
export async function syncS3Files(): Promise<void> {
  logger.info('Starting S3 file synchronization job')

  try {
    const s3Files = await listAllS3Objects(env.S3_BUCKET_NAME)
    logger.info({ fileCount: s3Files.length }, 'Found files in S3')

    if (s3Files.length === 0) {
      logger.info('No files in S3, skipping synchronization')
      return
    }

    const dbFiles = await prisma.file.findMany({
      select: { s3Key: true }
    })
    const dbKeys = new Set(dbFiles.map((file) => file.s3Key))
    logger.info({ fileCount: dbKeys.size }, 'Found files in database')

    const orphanedFiles = s3Files.filter((key) => !dbKeys.has(key))
    logger.info(
      { fileCount: orphanedFiles.length },
      'Found orphaned files in S3'
    )

    let deletedCount = 0
    for (const key of orphanedFiles) {
      try {
        logger.debug({ key }, 'Deleting orphaned file')
        await deleteFileFromS3(key)
        deletedCount++
      } catch (error) {
        logger.error({ key, err: error }, 'Failed to delete orphaned file')
      }
    }

    logger.info(
      { totalOrphaned: orphanedFiles.length, deletedCount },
      'S3 file synchronization completed'
    )
  } catch (error) {
    logger.error({ err: error }, 'Error during S3 file synchronization')
  }
}

/**
 * List all object keys in an S3 bucket with pagination.
 */
async function listAllS3Objects(bucket: string): Promise<string[]> {
  const objects: string[] = []
  let continuationToken: string | undefined
  const MAX_ITERATIONS = 100
  let iterations = 0

  try {
    do {
      iterations++
      if (iterations > MAX_ITERATIONS) {
        logger.warn(
          { bucket, iterations },
          'Reached maximum iterations for listing S3 objects'
        )
        break
      }

      const command = new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
        MaxKeys: 1000
      })

      const response = await s3Client.send(command)

      if (response.Contents) {
        for (const object of response.Contents)
          if (object.Key) objects.push(object.Key)
      }

      continuationToken = response.NextContinuationToken
    } while (continuationToken)

    return objects
  } catch (error) {
    logger.error({ bucket, err: error }, 'Error listing S3 objects')
    return []
  }
}
