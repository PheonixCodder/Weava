"use client";

import React from 'react'
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

const Home = () => {

  
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const { data } = useQuery(trpc.getWorkflows.queryOptions())

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }))

  return (
    <div>
      <h1>Accounts</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>Create Workflow</Button>
    </div>
  )
}

export default Home
