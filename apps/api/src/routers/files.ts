import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { FileInput } from "@repo/schema";
import { publicProcedure, router } from "../server/trpc";
import prisma from "../prisma";
import { uploadFileToS3 } from "../services/s3";
import { kafkaService } from "../services/kafka";

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

export const filesRouter = router({
  // Upload multiple files at once
  uploadFiles: publicProcedure
    .input(uploadFilesSchema)
    .mutation(async ({ input }) => {
      const { files } = input;
      const results = [];
      const errors = [];

      // Process each file
      await Promise.all(
        files.map(async ({ name, file }) => {
          try {
            if (!file.buffer) {
              throw new Error("File buffer is required");
            }

            const timestamp = Date.now();
            const s3Key = `${timestamp}-${file.originalname.replace(/\s+/g, "-")}`;

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

            // Publish to Kafka
            await kafkaService.publishFileUploaded(newFile);

            // Add to results
            results.push(newFile);
          } catch (error) {
            console.error(`Error uploading file ${file.originalname}:`, error);
            errors.push({
              filename: file.originalname,
              error: error instanceof Error ? error.message : "Unknown error",
            });
          }
        })
      );

      return {
        success: errors.length === 0,
        files: results,
        errors: errors.length > 0 ? errors : undefined,
      };
    }),
});
