"use client"
import React from 'react'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/useWorkflows'
import { EntityContainer, EntityHeader } from '@/components/entity-components'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'

const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
  return (
    <div className='flex-1 flex justify-center items-center'>
      {JSON.stringify(workflows)}
    </div>
  )
}

export default WorkflowsList

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const createWorkflow = useCreateWorkflow()
  const { handleError, modal } = useUpgradeModal();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  }

  return (
    <>
    <EntityHeader title="Workflows" description='Create and manage your workflows' onNew={handleCreateWorkflow} newButtonLabel={"New Workflow"} disabled={disabled} isCreating={createWorkflow.isPending} />
    {modal}
    </>
  )
}

export const WorkflowsContainer = ( { children }: { children: React.ReactNode}) => {
  return (
    <EntityContainer header={<WorkflowsHeader />} search={<></>} pagination={<></>}>
        {children}
    </EntityContainer>
  )
}