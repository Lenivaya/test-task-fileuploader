'use client'

import { trpc } from '@file-uploader/trpc/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink } from '@trpc/client'
import { useMemo } from 'react'
import superjson from 'superjson'
import { env } from '../env'

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            refetchOnWindowFocus: false
          }
        }
      }),
    []
  )

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [
          httpLink({
            transformer: superjson,
            url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
            fetch(url, options) {
              return fetch(url, {
                ...options,
                credentials: 'include'
              })
            }
          })
        ]
      }),
    []
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
