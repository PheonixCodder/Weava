import { LoginForm } from '@/app/features/auth/components/login-form'
import { requireNoAuth } from '@/lib/auth-utils';
import React from 'react'

const Login = async () => {
      await requireNoAuth();
  return (
      <LoginForm />
  )
}

export default Login
