import { ExecutionsError, ExecutionsLoading } from '@/features/executions/components/executions'
import { ExecuteView } from '@/features/executions/execution'
import { prefetchExecution } from '@/features/executions/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface PageProps {
    params : Promise<{
        executionId : string
    }>
}

const Page = async ( {params} : PageProps) => {
  await requireAuth()
  prefetchExecution((await params).executionId);
  return (
    <div className='p-4 md:px-10 md:py-6 h-full'>
      <div className='mx-auto max-w-screen-md justify-center w-full flex flex-col gap-y-8 h-full'>
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
          <ExecuteView executionId={(await params).executionId} />
          </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  )
}

export default Page
