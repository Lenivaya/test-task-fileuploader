import { router } from './trpc'
import { fileRouter } from '../routers/file'
import { filesRouter } from '../routers/files'

// Merge all feature routers
export const appRouter = router({
  file: fileRouter,
  files: filesRouter
})

// Export router type
export type AppRouter = typeof appRouter
