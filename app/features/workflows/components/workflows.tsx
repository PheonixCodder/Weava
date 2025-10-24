"use client"
import React from 'react'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from '@/components/entity-components'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'
import { useWorkflowParams } from '../hooks/use-workflows-params'
import { useEntitySearch } from '@/hooks/use-entity-search'

export const WorkflowsPagination = () => {
  const workflows = useSuspenseWorkflows()
  const [params, setParams] = useWorkflowParams()

  return (
    <EntityPagination disabled={workflows.isFetching} page={workflows.data.page} totalPages={workflows.data.totalPages} onPageChange={(page) => setParams({...params, page})} />
  )
}

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowParams()
  const { searchValue, setSearchChange } = useEntitySearch({params, setParams})
  return (
    <EntitySearch value={searchValue} onChange={setSearchChange} placeholder="Search workflows" />
  )
}

const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
  return (
    <div className='flex-1 flex justify-center items-center'>
      {JSON.stringify(workflows.data)}
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
    <EntityContainer header={<WorkflowsHeader />} search={<WorkflowSearch />} pagination={<WorkflowsPagination />}>
        {children}
    </EntityContainer>
  )
}