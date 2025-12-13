import { inferProcedureInput } from "@trpc/server";
import { prefetch, trpc } from "@/trpc/server";
import { appRouter } from "@/trpc/routers/_app";

type Input = inferProcedureInput<(typeof appRouter)["executions"]["getMany"]>;

export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.executions.getMany.queryOptions(params));
};

export const prefetchExecution = (id: string) => {
  return prefetch(trpc.executions.getOne.queryOptions({ id }));
};