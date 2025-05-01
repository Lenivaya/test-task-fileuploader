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

export const fileRouter = router({
  // Get all files
  getFiles: publicProcedure.query(async () => {
    const files = await prisma.file.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
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
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File buffer is required",
          });
        }

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

        return newFile;
      } catch (error) {
        console.error("Error uploading file:", error);
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      try {
        // Delete from S3
        await deleteFileFromS3(file.s3Key);

        // Delete from database
        await prisma.file.delete({
          where: { id },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting file:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      }
    }),
});
