import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import prisma from '../prisma'
import { env } from '../env'
import { logger } from '../logger'
import { s3Client, deleteFileFromS3 } from '../services/s3'

/**
 * Sync S3 files with database
 * This job checks if files in S3 exist in the database
 * If not, it deletes them from S3
 */
export async function syncS3Files(): Promise<void> {
  logger.info('Starting S3 file synchronization job')
  try {
    const s3Files = await listAllS3Objects(env.S3_BUCKET_NAME)
    logger.info({ fileCount: s3Files.length }, 'Found files in S3')

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

    if (orphanedFiles.length > 0) {
      for (const key of orphanedFiles) {
        logger.debug({ key }, 'Deleting orphaned file')
        await deleteFileFromS3(key)
      }
      logger.info(
        { fileCount: orphanedFiles.length },
        'Deleted orphaned files from S3'
      )
    } else {
      logger.info('No orphaned files found')
    }

    logger.info('S3 file synchronization completed successfully')
  } catch (error) {
    logger.error({ err: error }, 'Error during S3 file synchronization')
  }
}

/**
 * List all objects in an S3 bucket
 */
async function listAllS3Objects(bucket: string): Promise<string[]> {
  const objects: string[] = []
  let continuationToken: string | undefined

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken
    })

    const response = await s3Client.send(command)

    if (response.Contents) {
      for (const object of response.Contents) {
        if (object.Key) objects.push(object.Key)
      }
    }

    continuationToken = response.NextContinuationToken
  } while (continuationToken)

  return objects
}
