import { createTRPCReact } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "./server/routers";

export const trpc = createTRPCReact<AppRouter>({ abortOnUnmount: true });

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
