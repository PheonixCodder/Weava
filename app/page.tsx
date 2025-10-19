import { caller } from '@/trpc/server'
import React from 'react'
import LogoutBtn from './features/auth/components/logout';
import { requireAuth } from '@/lib/auth-utils';

const Home = async () => {
  await requireAuth();
  const accounts = await caller.getAccounts();
  return (
    <div>
      <h1>Accounts</h1>
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
      <LogoutBtn />
    </div>
  )
}

export default Home
