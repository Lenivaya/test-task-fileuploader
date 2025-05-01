import { File } from '@file-uploader/schema'
import { z } from 'zod'
import { logger } from '../logger'
import prisma from '../prisma'
import { publicProcedure, router } from '../server/trpc'
import { kafkaService } from '../services/kafka'
import { uploadFileToS3 } from '../services/s3'

const uploadFilesSchema = z.object({
  files: z.array(
    z.object({
      name: z.string().min(1),
      file: z.object({
        buffer: z.instanceof(Buffer).optional(),
        originalname: z.string(),
        mimetype: z.string(),
        size: z.number().int().positive()
      })
    })
  )
})

type FileUploadError = {
  filename: string
  error: string
}

async function processFileCreation(
  name: string,
  file: {
    buffer?: Buffer
    originalname: string
    mimetype: string
    size: number
  }
): Promise<{ result?: File; error?: FileUploadError }> {
  try {
    if (!file.buffer) {
      logger.warn(
        { name, originalName: file.originalname },
        'File buffer is missing'
      )
      throw new Error('File buffer is required')
    }

    const timestamp = Date.now()
    const s3Key = `${timestamp}-${file.originalname.replace(/\s+/g, '-')}`

    logger.debug(
      { name, originalName: file.originalname },
      'Uploading file to S3'
    )
    const url = await uploadFileToS3(s3Key, file.buffer, file.mimetype)

    const newFile = await prisma.file.create({
      data: {
        name,
        originalName: file.originalname,
        url,
        s3Key,
        size: file.size,
        mimeType: file.mimetype,
        status: 'READY'
      }
    })

    logger.info(
      { fileId: newFile.id, name, size: file.size },
      'File uploaded successfully'
    )

    await kafkaService.publishFileUploaded(newFile)

    return { result: newFile }
  } catch (error) {
    logger.error(
      { err: error, name, originalName: file.originalname },
      'Error uploading file'
    )
    return {
      error: {
        filename: file.originalname,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const filesRouter = router({
  uploadFiles: publicProcedure
    .input(uploadFilesSchema)
    .mutation(async ({ input }) => {
      const { files } = input
      const results: File[] = []
      const errors: FileUploadError[] = []

      logger.info({ count: files.length }, 'Processing multiple file uploads')

      await Promise.all(
        files.map(async ({ name, file }) => {
          const { result, error } = await processFileCreation(name, file)
          if (result) {
            results.push(result)
          }
          if (error) {
            errors.push(error)
          }
        })
      )

      logger.info(
        {
          success: errors.length === 0,
          total: files.length,
          succeeded: results.length,
          failed: errors.length
        },
        'Completed multiple file uploads'
      )

      return {
        success: errors.length === 0,
        files: results,
        errors: errors.length > 0 ? errors : undefined
      }
    })
})
