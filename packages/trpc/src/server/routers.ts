import { router } from './trpc'
import { fileRouter } from '../routers/file'
import { filesRouter } from '../routers/files'
import { uploadRouter } from '../routers/upload'

// Merge all feature routers
export const appRouter = router({
  file: fileRouter,
  files: filesRouter,
  upload: uploadRouter
})

// Export router type
export type AppRouter = typeof appRouter
