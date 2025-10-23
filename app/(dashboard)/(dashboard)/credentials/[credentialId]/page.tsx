import { requireAuth } from "@/lib/auth-utils";
import React from "react";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  return <div></div>;
};

export default Page;
