import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../server/trpc";
import { getUploadProgress } from "../utils/fileUploadHelper";

export const uploadRouter = router({
  // Get upload progress for a file
  getProgress: publicProcedure
    .input(z.object({ fileId: z.string() }))
    .query(({ input }) => {
      const { fileId } = input;
      const progress = getUploadProgress(fileId);

      if (!progress) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Upload progress not found",
        });
      }

      return progress;
    }),
});
