import { initTRPC } from '@trpc/server'
import { logger } from '../logger'
import superjson from 'superjson'

// Initialize tRPC
const t = initTRPC.create({
  transformer: superjson
})

// Create logging middleware
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()

  const result = await next()

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

export const middleware = t.middleware
export const router = t.router

export const publicProcedure = t.procedure.use(loggerMiddleware)
