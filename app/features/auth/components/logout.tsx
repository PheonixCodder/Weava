"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutBtn = () => {
  const router = useRouter();
  return (
    <div>
      <Button
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/login"); // redirect to login page
              },
            },
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default LogoutBtn;
