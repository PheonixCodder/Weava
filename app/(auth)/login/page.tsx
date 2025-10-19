import { LoginForm } from '@/app/features/auth/components/login-form'
import { requireNoAuth } from '@/lib/auth-utils';
import React from 'react'

const Login = async () => {
      await requireNoAuth();
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <LoginForm />
    </div>
  )
}

export default Login
