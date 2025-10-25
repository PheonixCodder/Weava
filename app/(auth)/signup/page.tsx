import { SignUpForm } from "@/features/auth/components/signup-form";
import { requireNoAuth } from "@/lib/auth-utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignUp = async () => {
  await requireNoAuth();
  return <SignUpForm />;
};

export default SignUp;
