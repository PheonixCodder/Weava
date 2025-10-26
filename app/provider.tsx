import { TRPCReactProvider } from '@/trpc/client'
import { Provider } from 'jotai'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import React from 'react'
import { Toaster } from 'sonner'

const Providers = ( { children }: { children: React.ReactNode }) => {
  return (
    <>
    <TRPCReactProvider>
          <NuqsAdapter>
            <Provider>{children}</Provider>
            <Toaster />
          </NuqsAdapter>
        </TRPCReactProvider>
    </>
  )
}

export default Providers
