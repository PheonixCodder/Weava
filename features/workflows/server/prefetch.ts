import { inferProcedureInput } from "@trpc/server";
import { prefetch, trpc } from "@/trpc/server";
import { appRouter } from "@/trpc/routers/_app";

type Input = inferProcedureInput<(typeof appRouter)["workflows"]["getMany"]>;

export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

export const prefetchWorkflow = (id: string) => {
  return prefetch(trpc.workflows.getOne.queryOptions({ id }));
};