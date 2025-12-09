import { inferProcedureInput } from "@trpc/server";
import { prefetch, trpc } from "@/trpc/server";
import { appRouter } from "@/trpc/routers/_app";

type Input = inferProcedureInput<(typeof appRouter)["credentials"]["getMany"]>;

export const prefetchCredentials = (params: Input) => {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

export const prefetchCredential = (id: string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id }));
};