import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useExecutionParams } from "./use-executions-params";

// ------------------------------------------------------
// GET MANY (with pagination + search)
// ------------------------------------------------------
export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionParams(); // { page, pageSize, search }

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

// ------------------------------------------------------
// GET ONE
// ------------------------------------------------------
export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
