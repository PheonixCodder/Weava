"use client";

import React from "react";
import {
  useSuspenseExecutions,
} from "@/features/executions/hooks/use-executions";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useExecutionParams } from "@/features/executions/hooks/use-executions-params";
import { formatDistanceToNow } from "date-fns";
import { ExecutionStatus, Execution } from "@prisma/client";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  XCircleIcon,
} from "lucide-react";

// ------------------------------------------------------
// LOADING
// ------------------------------------------------------
export const ExecutionsLoading = () => {
  return <LoadingView message="Loading executions" />;
};

// ------------------------------------------------------
// ERROR
// ------------------------------------------------------
export const ExecutionsError = () => {
  return <ErrorView message="Error loading executions" />;
};

// ------------------------------------------------------
// PAGINATION
// ------------------------------------------------------
export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      page={executions.data.page}
      totalPages={executions.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

// ------------------------------------------------------
// STATUS ICON
// ------------------------------------------------------
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

// ------------------------------------------------------
// ITEM
// ------------------------------------------------------
type ExecutionItemProps = Execution & {
  workflow: { id: string; name: string };
};

export const ExecutionItem = ({ data }: { data: ExecutionItemProps }) => {
  // Normalize dates (critical)
  const createdAt = data.createdAt;
  const startedAt = data.startedAt!;
  const completedAt = data.completedAt
    ? new Date(data.completedAt)
    : null;

  const duration =
    completedAt !== null
      ? Math.round(
          (completedAt.getTime() - createdAt.getTime()) / 1000
        )
      : null;

  return (
    <EntityItem
      title={data.workflow.name}
      href={`/executions/${data.id}`}
      image={getStatusIcon(data.status)}
      subTitle={
        <>
          <span className="capitalize">
            {data.status.toLowerCase()}
          </span>
          {" • Started "}
          {formatDistanceToNow(startedAt, { addSuffix: true })}
          {duration !== null && ` • Duration: ${duration}s`}
        </>
      }
    />
  );
};

// ------------------------------------------------------
// LIST
// ------------------------------------------------------
export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      renderItem={(execution: ExecutionItemProps) => (
        <ExecutionItem data={execution} />
      )}
      emptyView={<ExecutionsEmpty />}
      getKey={(execution: ExecutionItemProps) => execution.id}
    />
  );
};


// ------------------------------------------------------
// HEADER
// ------------------------------------------------------
export const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="View your executions and their details."
    />
  );
};

// ------------------------------------------------------
// CONTAINER
// ------------------------------------------------------
export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

// ------------------------------------------------------
// EMPTY VIEW
// ------------------------------------------------------
export const ExecutionsEmpty = () => {
  return (
    <EmptyView message="You haven't run any workflows yet. Execute a workflow to get started." />
  );
};
