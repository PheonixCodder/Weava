"use client"
import React from 'react'
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from '@/components/entity-components'
import { useUpgradeModal } from '@/hooks/use-upgrade-modal'
import { useRouter } from 'next/navigation'
import { useWorkflowParams } from '../hooks/use-workflows-params'
import { useEntitySearch } from '@/hooks/use-entity-search'
import { Workflow } from '@/lib/generated/prisma'
import { WorkflowIcon } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"

export const WorkflowsLoading = () => {
  return (
    <LoadingView message="Loading workflows" />
  )
}

export const WorkflowsError = () => {
  return (
    <ErrorView message="Error loading workflows" />
  )
}

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


export const WorkflowItem = ({data} : { data: Workflow}) => {
  
  const removeWorkflow = useRemoveWorkflow();

  const handleRemoveWorkflow = () => {
    removeWorkflow.mutate({id: data.id});
  }

  return (
    <EntityItem title={data.name} href={`/workflows/${data.id}`} subTitle={<>Updated {formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })} &bull; Created {formatDistanceToNow(new Date(data.createdAt) , { addSuffix: true })} </>} image={<div className='size-8 flex items-center justify-center'><WorkflowIcon /></div>} onRemove={handleRemoveWorkflow} isRemoving={removeWorkflow.isPending} />
  )
}

const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows()
    
    return (
      <EntityList items={workflows.data.items} renderItem={(workflow) => <WorkflowItem data={workflow} />} emptyView={<WorkflowsEmpty />} getKey={(workflow) => workflow.id} />
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

export const WorkflowsEmpty = () => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal()
  const router = useRouter();

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
    {modal}
    <EmptyView message="You haven't created any workflows yet. Click the button below to get started" onNew={handleCreateWorkflow} />
    </>
  )
}