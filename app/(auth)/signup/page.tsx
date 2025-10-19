import { SignUpForm } from '@/app/features/auth/components/signup-form'
import { requireNoAuth } from '@/lib/auth-utils';
import React from 'react'

const SignUp = async () => {
    await requireNoAuth();
  return (
        <SignUpForm />
  )
}

export default SignUp
