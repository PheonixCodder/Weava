"use client";
import React from "react";
import {
  useCreateCredential,
  useRemoveCredential,
  useSuspenseCredentials,
} from "@/features/credentials/hooks/use-credentials";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useCredentialParams } from "@/features/credentials/hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { BadgeCheck } from "lucide-react"; // Replace with any icon you want
import { formatDistanceToNow } from "date-fns";
import { Credential, CredentialType } from "@prisma/client";

// ------------------------------------------------------
// LOADING
// ------------------------------------------------------
export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials" />;
};

// ------------------------------------------------------
// ERROR
// ------------------------------------------------------
export const CredentialsError = () => {
  return <ErrorView message="Error loading credentials" />;
};

// ------------------------------------------------------
// PAGINATION
// ------------------------------------------------------
export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      page={credentials.data.page}
      totalPages={credentials.data.totalPages}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

// ------------------------------------------------------
// SEARCH
// ------------------------------------------------------
export const CredentialSearch = () => {
  const [params, setParams] = useCredentialParams();
  const { searchValue, setSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={setSearchChange}
      placeholder="Search credentials"
    />
  );
};

// ------------------------------------------------------
// ITEM
// ------------------------------------------------------
export const CredentialItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  return (
    <EntityItem
      title={data.name}
      href={`/credentials/${data.id}`}
      subTitle={
        <>
          Updated{" "}
          {formatDistanceToNow(new Date(data.updatedAt), {
            addSuffix: true,
          })}{" "}
          • Created{" "}
          {formatDistanceToNow(new Date(data.createdAt), {
            addSuffix: true,
          })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <BadgeCheck />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};

// ------------------------------------------------------
// LIST
// ------------------------------------------------------
const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      renderItem={(credential: Credential) => (
        <CredentialItem data={credential} />
      )}
      emptyView={<CredentialsEmpty />}
      getKey={(credential: Credential) => credential.id}
    />
  );
};

export default CredentialsList;

// ------------------------------------------------------
// HEADER
// ------------------------------------------------------
export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
    return (
    <>
      <EntityHeader
        title="Credentials"
        description="Create and manage your credentials"
        newButtonHref="/credentials/new"
        newButtonLabel="New Credential"
        disabled={disabled}
      />
    </>
  );
};

// ------------------------------------------------------
// CONTAINER
// ------------------------------------------------------
export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

// ------------------------------------------------------
// EMPTY VIEW
// ------------------------------------------------------
export const CredentialsEmpty = () => {
  const createCredential = useCreateCredential();
  const { handleError, modal } = useUpgradeModal();
  const router = useRouter();

  const handleCreate = () => {
    router.push("/credentials/new");
  };

  return (
    <>
      {modal}
      <EmptyView
        message="You haven't added any credentials yet. Click the button below to add one."
        onNew={handleCreate}
      />
    </>
  );
};
