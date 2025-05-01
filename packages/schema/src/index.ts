import { z } from "zod";

// File status enum
export const FileStatusEnum = z.enum(["PENDING", "READY", "ERROR"]);
export type FileStatus = z.infer<typeof FileStatusEnum>;

// Base file schema
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
  updatedAt: z.date(),
});

export type File = z.infer<typeof fileSchema>;

// Schema for file input (from client)
export const fileInputSchema = z.object({
  buffer: z.instanceof(Buffer).optional(),
  originalname: z.string(),
  mimetype: z.string(),
  size: z.number().int().positive(),
});

export type FileInput = z.infer<typeof fileInputSchema>;

// Schema for upload files request
export const uploadFilesSchema = z.object({
  files: z.array(
    z.object({
      name: z.string().min(1),
      file: fileInputSchema,
    })
  ),
});

export type UploadFilesInput = z.infer<typeof uploadFilesSchema>;

// Schema for creating a new file
export const createFileSchema = z.object({
  name: z.string().min(1),
  content: z.string(), // Base64 encoded file content
  size: z
    .number()
    .int()
    .positive()
    .max(10 * 1024 * 1024), // 10MB max size
  type: z.string(), // MIME type
});

export type CreateFileInput = z.infer<typeof createFileSchema>;

// Schema for deleting a file
export const deleteFileSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteFileInput = z.infer<typeof deleteFileSchema>;
