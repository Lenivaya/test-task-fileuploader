import { initTRPC } from '@trpc/server'
import { logger } from '../logger'

// Initialize tRPC
const t = initTRPC.create()

// Create logging middleware
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()

  // Execute the request
  const result = await next()

  // Log the request with timing information
  const durationMs = Date.now() - start
  const meta = { path, type, durationMs }

  if (result.ok) {
    logger.debug(meta, `tRPC ${type} request completed successfully`)
  } else {
    logger.error(
      { ...meta, error: result.error },
      `tRPC ${type} request failed`
    )
  }

  return result
})

// Export tRPC helpers
export const middleware = t.middleware
export const router = t.router

// Add logging middleware to all procedures
export const publicProcedure = t.procedure.use(loggerMiddleware)
