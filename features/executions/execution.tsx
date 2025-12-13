"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Execution, ExecutionStatus } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useSuspenseExecution } from './hooks/use-executions';

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return <CheckCircle2Icon className="text-green-500" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="text-red-500" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="animate-spin text-blue-500" />;
    default:
      return <ClockIcon className="text-muted-foreground" />;
  }
};

export const ExecuteView = ({ executionId }: { executionId: string }) => {
    const { data: execution } = useSuspenseExecution(executionId);
    const [showStackTrace, setShowStackTrace] = useState(false);
    const createdAt = execution.createdAt;
  const startedAt = execution.startedAt!;
  const completedAt = execution.completedAt
    ? new Date(execution.completedAt)
    : null;
      const duration =
        completedAt !== null
          ? Math.round(
              (completedAt.getTime() - createdAt.getTime()) / 1000
            )
          : null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className='flex items-center gap-3'>
          {getStatusIcon(execution.status)}
        </div>
        <div>
        <CardTitle className="flex items-center gap-2 capitalize">
            {execution.status.toLowerCase()}
        </CardTitle>
        </div>
        <CardDescription>
          Execution for {execution.workflow.name}
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Workflow
              </p>
              <Link prefetch href={`/workflows/${execution.workflow.id}`} className='text-sm hover:underline text-primary'>
              {execution.workflow.name}
              </Link>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Status</p>
              <p className='capitalize text-sm'>
                {execution.status.toLowerCase()}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Started</p>
              <p className='capitalize text-sm'>
                {formatDistanceToNow(startedAt, { addSuffix: true })}
              </p>
            </div>
            {execution.completedAt && (
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Completed</p>
              <p className='capitalize text-sm'>
                {formatDistanceToNow(completedAt!, { addSuffix: true })}
              </p>
            </div>
            )}
            {duration !== null && (
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Duration</p>
              <p className='capitalize text-sm'>
                {duration}s
              </p>
            </div>
            )}
              <div>
                <p className='text-sm font-medium text-muted-foreground'>Inngest Event ID</p>
                <p className='text-sm break-all'>
                  {execution.inngestEventId}
                </p>
              </div>
          </div>
          <div>
            {execution.error && (
              <div className='mt-6 p-4 bg-red-50 rounded-md space-y-3'>
                <div>
                  <p className='text-sm font-medium text-red-900 mb-2'>Error</p>
                  <p className='text-sm text-red-800 font-mono'>{execution.error}</p>
                  </div>
                  {execution.errorStack && (
                    <Collapsible open={showStackTrace} onOpenChange={setShowStackTrace}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className='text-red-900 hover:bg-red-100' onClick={() => setShowStackTrace(!showStackTrace)}>
                          {showStackTrace ? "Hide Stack Trace" : "Show Stack Trace"}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <pre className='mt-2 p-4 bg-red-100 rounded overflow-auto text-sm font-mono text-red-800'>
                          {execution.errorStack}
                        </pre>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
              </div>
            )}
            </div>
            {execution.output && (
              <div className='mt-6'>
                <p className='text-sm font-medium mb-2'>Output</p>
                <pre className='p-4 bg-muted rounded text-sm overflow-auto'>
                  {JSON.stringify(execution.output, null, 2)}
                </pre>
              </div>
            )}
        </CardContent>
    </Card>
  )
}