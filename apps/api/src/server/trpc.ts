import { initTRPC } from "@trpc/server";

// Initialize tRPC
const t = initTRPC.create();

// Export tRPC helpers
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
