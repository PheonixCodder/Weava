import { inferProcedureInput } from "@trpc/server";
import { prefetch, trpc } from "@/trpc/server";
import { appRouter } from "@/trpc/routers/_app";

// ✅ Infer from the router itself, not the trpc proxy
type Input = inferProcedureInput<(typeof appRouter)["workflows"]["getMany"]>;

export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};
