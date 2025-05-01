import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { publicProcedure, router } from '../server/trpc'
import { getUploadProgress } from '../utils/fileUploadHelper'
import { logger } from '../logger'

export const uploadRouter = router({
  // Get upload progress for a file
  getProgress: publicProcedure
    .input(z.object({ fileId: z.string() }))
    .query(({ input }) => {
      const { fileId } = input
      logger.debug({ fileId }, 'Checking upload progress')

      const progress = getUploadProgress(fileId)

      if (!progress) {
        logger.warn({ fileId }, 'Upload progress not found')
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Upload progress not found'
        })
      }

      logger.debug(
        { fileId, progressPercent: progress.progress },
        'Upload progress retrieved'
      )
      return progress
    })
})
