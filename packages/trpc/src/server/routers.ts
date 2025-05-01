import { router } from './trpc'
import { fileRouter } from '../routers/file'
import { filesRouter } from '../routers/files'

export const appRouter = router({
  file: fileRouter,
  files: filesRouter
})

export type AppRouter = typeof appRouter
