import { LoginForm } from "@/features/auth/components/login-form";
import { requireNoAuth } from "@/lib/auth-utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Login = async () => {
  await requireNoAuth();

  return <LoginForm />;
};

export default Login;
