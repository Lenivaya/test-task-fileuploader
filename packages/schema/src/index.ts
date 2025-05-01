import { z } from 'zod'

/**
 * File status values for file processing lifecycle.
 * - PENDING: File is being processed or uploaded.
 * - READY: File is available and ready for use.
 * - ERROR: File processing failed.
 */
export const FileStatusEnum = z.enum(['PENDING', 'READY', 'ERROR'])
export type FileStatus = z.infer<typeof FileStatusEnum>

/**
 * Schema representing a file stored in the system.
 */
export const fileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  originalName: z.string().min(1),
  url: z.string().url(),
  s3Key: z.string(),
  size: z.number().int().positive(),
  mimeType: z.string(),
  status: FileStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date()
})

export type File = z.infer<typeof fileSchema>

/**
 * Schema for file input received from the client.
 */
export const fileInputSchema = z.object({
  buffer: z.instanceof(Buffer).optional(),
  originalname: z.string(),
  mimetype: z.string(),
  size: z.number().int().positive()
})

export type FileInput = z.infer<typeof fileInputSchema>

/**
 * Schema for a request to upload multiple files.
 */
export const uploadFilesSchema = z.object({
  files: z.array(
    z.object({
      name: z.string().min(1),
      file: fileInputSchema
    })
  )
})

export type UploadFilesInput = z.infer<typeof uploadFilesSchema>

/**
 * Schema for creating a new file from base64 content.
 * - content: Base64 encoded file content.
 * - size: File size in bytes (max 10MB).
 * - type: MIME type.
 */
export const createFileSchema = z.object({
  name: z.string().min(1),
  content: z.string(),
  size: z
    .number()
    .int()
    .positive()
    .max(10 * 1024 * 1024),
  type: z.string()
})

export type CreateFileInput = z.infer<typeof createFileSchema>

/**
 * Schema for deleting a file by its unique ID.
 */
export const deleteFileSchema = z.object({
  id: z.string().uuid()
})

export type DeleteFileInput = z.infer<typeof deleteFileSchema>
