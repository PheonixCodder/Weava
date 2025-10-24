import WorkflowsList, { WorkflowsContainer } from "@/app/features/workflows/components/workflows";
import { workflowParamsLoader } from "@/app/features/workflows/server/params-loader";
import { prefetchWorkflows } from "@/app/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Loader2Icon } from "lucide-react";
import type { SearchParams } from "nuqs/server";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>
}

const Page = async ( { searchParams} : Props) => {
  
  await requireAuth();

  const params = await workflowParamsLoader(searchParams)

  prefetchWorkflows(params);
  return (
    <WorkflowsContainer>
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<div className="h-full flex justify-center items-center"><Loader2Icon className="animate-spin text-primary size-5" /></div>}>
          <WorkflowsList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
    </WorkflowsContainer>
  );
};

export default Page;
