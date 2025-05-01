import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { File, FileInput } from "@repo/schema";
import { publicProcedure, router } from "../server/trpc";
import prisma from "../prisma";
import { uploadFileToS3 } from "../services/s3";
import { kafkaService } from "../services/kafka";
import { logger } from "../logger";

// Schema for uploading multiple files
const uploadFilesSchema = z.object({
  files: z.array(
    z.object({
      name: z.string().min(1),
      file: z.object({
        buffer: z.instanceof(Buffer).optional(),
        originalname: z.string(),
        mimetype: z.string(),
        size: z.number().int().positive(),
      }),
    })
  ),
});

// Error structure for file upload errors
type FileUploadError = {
  filename: string;
  error: string;
};

export const filesRouter = router({
  // Upload multiple files at once
  uploadFiles: publicProcedure
    .input(uploadFilesSchema)
    .mutation(async ({ input }) => {
      const { files } = input;
      const results: File[] = [];
      const errors: FileUploadError[] = [];

      logger.info({ count: files.length }, "Processing multiple file uploads");

      // Process each file
      await Promise.all(
        files.map(async ({ name, file }) => {
          try {
            if (!file.buffer) {
              logger.warn(
                { name, originalName: file.originalname },
                "File buffer is missing"
              );
              throw new Error("File buffer is required");
            }

            const timestamp = Date.now();
            const s3Key = `${timestamp}-${file.originalname.replace(/\s+/g, "-")}`;

            logger.debug(
              { name, originalName: file.originalname },
              "Uploading file to S3"
            );
            // Upload to S3
            const url = await uploadFileToS3(s3Key, file.buffer, file.mimetype);

            // Save to database
            const newFile = await prisma.file.create({
              data: {
                name,
                originalName: file.originalname,
                url,
                s3Key,
                size: file.size,
                mimeType: file.mimetype,
                status: "READY",
              },
            });

            logger.info(
              { fileId: newFile.id, name, size: file.size },
              "File uploaded successfully"
            );

            // Publish to Kafka
            await kafkaService.publishFileUploaded(newFile);

            // Add to results
            results.push(newFile);
          } catch (error) {
            logger.error(
              { err: error, name, originalName: file.originalname },
              "Error uploading file"
            );
            errors.push({
              filename: file.originalname,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        })
      );

      logger.info(
        {
          success: errors.length === 0,
          total: files.length,
          succeeded: results.length,
          failed: errors.length,
        },
        "Completed multiple file uploads"
      );

      return {
        success: errors.length === 0,
        files: results,
        errors: errors.length > 0 ? errors : undefined,
      };
    }),
});
