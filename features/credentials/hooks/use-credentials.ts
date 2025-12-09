import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialParams } from "./use-credentials-params";

// ------------------------------------------------------
// GET MANY (with pagination + search)
// ------------------------------------------------------
export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialParams(); // { page, pageSize, search }

  return useSuspenseQuery(
    trpc.credentials.getMany.queryOptions(params)
  );
};

// ------------------------------------------------------
// GET ONE
// ------------------------------------------------------
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({ id })
  );
};

// ------------------------------------------------------
// CREATE
// ------------------------------------------------------
export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential ${data.name} created`);

        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

// ------------------------------------------------------
// REMOVE
// ------------------------------------------------------
export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential removed`);

        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
};

// ------------------------------------------------------
// UPDATE (name, type, value)
// ------------------------------------------------------
export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential ${data.name} updated`);

        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );

        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update credential: ${error.message}`);
      },
    })
  );
};

// ------------------------------------------------------
// GET BY TYPE
// ------------------------------------------------------
export const useCredentialsByType = (type: any) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.credentials.getByType.queryOptions({ type })
  );
};
