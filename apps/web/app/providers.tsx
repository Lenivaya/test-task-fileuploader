'use client'

import { trpc } from '@file-uploader/trpc/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, httpLink } from '@trpc/client'
import { useState } from 'react'
import { env } from '../env'

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
          // Optional: When using in a browser, you can include credentials
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include'
            })
          }
        })
      ]
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
