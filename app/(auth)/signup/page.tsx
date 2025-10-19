import { SignUpForm } from '@/app/features/auth/components/signup-form'
import { requireNoAuth } from '@/lib/auth-utils';
import React from 'react'

const SignUp = async () => {
    await requireNoAuth();
  return (
    <div className='flex min-h-screen items-center justify-center'>
        <SignUpForm />
    </div>
  )
}

export default SignUp
