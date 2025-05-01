import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createFileSchema,
  deleteFileSchema,
  FileInput,
  FileStatusEnum,
} from "@repo/schema";
import { publicProcedure, router } from "../server/trpc";
import prisma from "../prisma";
import { deleteFileFromS3, uploadFileToS3 } from "../services/s3";
import { kafkaService } from "../services/kafka";
import { logger } from "../logger";

export const fileRouter = router({
  // Get all files
  getFiles: publicProcedure.query(async () => {
    const files = await prisma.file.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    logger.debug({ count: files.length }, "Retrieved files");
    return files;
  }),

  // Upload a file
  uploadFile: publicProcedure
    .input(createFileSchema)
    .mutation(async ({ input }) => {
      const { name, file } = input;
      const timestamp = Date.now();
      const s3Key = `${timestamp}-${file.originalname.replace(/\s+/g, "-")}`;

      try {
        // Upload to S3
        if (!file.buffer) {
          logger.warn({ name }, "File buffer is missing");
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File buffer is required",
          });
        }

        logger.debug(
          { name, originalName: file.originalname },
          "Uploading file to S3"
        );
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

        return newFile;
      } catch (error) {
        logger.error(
          { err: error, name, originalName: file.originalname },
          "Error uploading file"
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
        });
      }
    }),

  // Delete a file
  deleteFile: publicProcedure
    .input(deleteFileSchema)
    .mutation(async ({ input }) => {
      const { id } = input;

      const file = await prisma.file.findUnique({
        where: { id },
      });

      if (!file) {
        logger.warn({ fileId: id }, "File not found for deletion");
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      try {
        // Delete from S3
        logger.debug(
          { fileId: id, s3Key: file.s3Key },
          "Deleting file from S3"
        );
        await deleteFileFromS3(file.s3Key);

        // Delete from database
        await prisma.file.delete({
          where: { id },
        });

        logger.info(
          { fileId: id, name: file.name },
          "File deleted successfully"
        );

        return { success: true };
      } catch (error) {
        logger.error({ err: error, fileId: id }, "Error deleting file");
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      }
    }),
});
